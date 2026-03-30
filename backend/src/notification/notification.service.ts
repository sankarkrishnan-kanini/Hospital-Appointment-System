import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';

@Injectable()
export class NotificationService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.notification.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.notification.findUnique({ where: { id } });
  }

  async create(data: CreateNotificationDto) {
    return await this.prisma.notification.create({ data });
  }

  async update(id: number, data: UpdateNotificationDto) {
    return await this.prisma.notification.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.notification.delete({ where: { id } });
  }
}
