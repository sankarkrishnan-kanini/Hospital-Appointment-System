import { Controller, Get, Post, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  // Get all chat rooms for the authenticated user
  @Get('rooms')
  async getRooms(@Request() req: any) {
    return this.chatService.getRoomsForUser(req.user.sub, req.user.role);
  }

  // Get messages for a specific room
  @Get('rooms/:roomId/messages')
  async getMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req: any,
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.chatService.getMessages(
      roomId,
      req.user.sub,
      take ? parseInt(take) : 50,
      cursor ? parseInt(cursor) : undefined,
    );
  }

  // Start or get a chat with a doctor (patient endpoint)
  @Post('start/:doctorId')
  async startChat(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Request() req: any,
  ) {
    return this.chatService.startChat(req.user.sub, doctorId);
  }

  // Mark messages as read
  @Post('rooms/:roomId/read')
  async markAsRead(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Request() req: any,
  ) {
    await this.chatService.markAsRead(roomId, req.user.sub);
    return { success: true };
  }

  // Get unread message count
  @Get('unread')
  async getUnreadCount(@Request() req: any) {
    const count = await this.chatService.getUnreadCount(req.user.sub, req.user.role);
    return { unreadCount: count };
  }
}
