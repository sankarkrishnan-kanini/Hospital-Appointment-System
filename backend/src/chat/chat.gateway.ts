import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userRole?: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track online users: userId → socketId
  private onlineUsers = new Map<number, string>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'hospital_jwt_secret_key',
      });

      client.userId = payload.sub;
      client.userRole = payload.role;

      // Register user as online
      this.onlineUsers.set(payload.sub, client.id);

      // Join a personal room for direct notifications
      client.join(`user_${payload.sub}`);

      client.emit('connected', { userId: payload.sub, message: 'Connected to chat' });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.onlineUsers.delete(client.userId);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: number },
  ) {
    if (!client.userId) return;

    const roomName = `room_${data.roomId}`;
    client.join(roomName);

    // Mark messages as read when joining
    await this.chatService.markAsRead(data.roomId, client.userId);

    // Notify the other participant that messages were read
    this.server.to(roomName).emit('messagesRead', {
      roomId: data.roomId,
      readBy: client.userId,
    });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: number },
  ) {
    client.leave(`room_${data.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: number; content: string },
  ) {
    if (!client.userId || !data.content?.trim()) return;

    const message = await this.chatService.saveMessage(
      data.roomId,
      client.userId,
      data.content.trim(),
    );

    // Broadcast to everyone in the room (including sender)
    this.server.to(`room_${data.roomId}`).emit('newMessage', message);

    // Find recipient userId for notification
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: data.roomId },
      include: {
        doctor: { select: { userId: true } },
        patient: { select: { userId: true } },
      },
    });

    if (room) {
      const recipientUserId =
        room.doctor.userId === client.userId ? room.patient.userId : room.doctor.userId;

      this.server.to(`user_${recipientUserId}`).emit('newMessageNotification', {
        roomId: data.roomId,
        message,
      });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: number },
  ) {
    if (!client.userId) return;
    client.to(`room_${data.roomId}`).emit('userTyping', {
      roomId: data.roomId,
      userId: client.userId,
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: number },
  ) {
    if (!client.userId) return;
    client.to(`room_${data.roomId}`).emit('userStopTyping', {
      roomId: data.roomId,
      userId: client.userId,
    });
  }

  // Check if a user is online
  isUserOnline(userId: number): boolean {
    return this.onlineUsers.has(userId);
  }
}
