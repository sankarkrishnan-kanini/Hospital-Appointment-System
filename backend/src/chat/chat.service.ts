import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Get or create a chat room between doctor and patient
  async getOrCreateRoom(doctorId: number, patientId: number) {
    let room = await this.prisma.chatRoom.findUnique({
      where: { doctorId_patientId: { doctorId, patientId } },
      include: {
        doctor: { select: { id: true, firstName: true, lastName: true, userId: true } },
        patient: { select: { id: true, firstName: true, lastName: true, userId: true } },
      },
    });

    if (!room) {
      room = await this.prisma.chatRoom.create({
        data: { doctorId, patientId },
        include: {
          doctor: { select: { id: true, firstName: true, lastName: true, userId: true } },
          patient: { select: { id: true, firstName: true, lastName: true, userId: true } },
        },
      });
    }

    return room;
  }

  // Get all chat rooms for a user
  async getRoomsForUser(userId: number, role: string) {
    if (role === 'doctor') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) return [];

      return this.prisma.chatRoom.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, userId: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, userId: true } },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    // Patient
    const patient = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!patient) return [];

    return this.prisma.chatRoom.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: { select: { id: true, firstName: true, lastName: true, userId: true } },
        patient: { select: { id: true, firstName: true, lastName: true, userId: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Get messages for a room (paginated)
  async getMessages(roomId: number, userId: number, take = 50, cursor?: number) {
    // Verify user belongs to this room
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        doctor: { select: { userId: true } },
        patient: { select: { userId: true } },
      },
    });

    if (!room) return [];
    if (room.doctor.userId !== userId && room.patient.userId !== userId) return [];

    const messages = await this.prisma.chatRoomMessage.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        sender: { select: { id: true, email: true, role: true } },
      },
    });

    return messages.reverse();
  }

  // Save a message
  async saveMessage(roomId: number, senderId: number, content: string) {
    const message = await this.prisma.chatRoomMessage.create({
      data: {
        chatRoomId: roomId,
        senderId,
        content,
      },
      include: {
        sender: { select: { id: true, email: true, role: true } },
      },
    });

    // Update room's updatedAt
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  // Mark messages as read
  async markAsRead(roomId: number, userId: number) {
    await this.prisma.chatRoomMessage.updateMany({
      where: {
        chatRoomId: roomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  // Get unread count for a user
  async getUnreadCount(userId: number, role: string) {
    if (role === 'doctor') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) return 0;

      const rooms = await this.prisma.chatRoom.findMany({
        where: { doctorId: doctor.id },
        select: { id: true },
      });

      return this.prisma.chatRoomMessage.count({
        where: {
          chatRoomId: { in: rooms.map((r) => r.id) },
          senderId: { not: userId },
          isRead: false,
        },
      });
    }

    const patient = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!patient) return 0;

    const rooms = await this.prisma.chatRoom.findMany({
      where: { patientId: patient.id },
      select: { id: true },
    });

    return this.prisma.chatRoomMessage.count({
      where: {
        chatRoomId: { in: rooms.map((r) => r.id) },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }

  // Start a chat from patient side (find doctor by id)
  async startChat(userId: number, doctorId: number) {
    const patient = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!patient) throw new Error('Patient profile not found');

    return this.getOrCreateRoom(doctorId, patient.id);
  }
}
