import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';

@Injectable()
export class NotificationService {

  constructor(private readonly prisma: PrismaService) {}

  // GET /notification
  async findAll() {
    return await this.prisma.notification.findMany({
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // GET /notification/:id
  async findOne(id: number) {
    const record = await this.prisma.notification.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, role: true } } }
    });
    if (!record) throw new NotFoundException(`Notification #${id} not found`);
    return record;
  }

  // POST /notification
  async create(data: CreateNotificationDto) {
    return await this.prisma.notification.create({ data });
  }

  // PATCH /notification/:id
  async update(id: number, data: UpdateNotificationDto) {
    return await this.prisma.notification.update({ where: { id }, data });
  }

  // DELETE /notification/:id
  async remove(id: number) {
    return await this.prisma.notification.delete({ where: { id } });
  }

  // GET /notification/user/:userId
  async findByUser(userId: number) {
    const records = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    if (!records.length) throw new NotFoundException(`No notifications found for user #${userId}`);
    return records;
  }

  // GET /notification/user/:userId/unread
  async findUnread(userId: number) {
    const records = await this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' }
    });
    return {
      count: records.length,
      notifications: records
    };
  }

  // PATCH /notification/:id/read
  async markAsRead(id: number) {
    const record = await this.prisma.notification.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Notification #${id} not found`);
    return await this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  // PATCH /notification/user/:userId/mark-all-read
  async markAllRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return { updated: result.count, message: `Marked ${result.count} notification(s) as read for user #${userId}` };
  }

  // DELETE /notification/user/:userId/clear-read
  async clearRead(userId: number) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId, isRead: true }
    });
    return { deleted: result.count, message: `Cleared ${result.count} read notification(s) for user #${userId}` };
  }
}
