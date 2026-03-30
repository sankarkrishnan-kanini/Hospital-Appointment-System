import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';

@Injectable()
export class NotificationService {

  findAll() {
    return prisma.notification.findMany();
  }

  findOne(id: number) {
    return prisma.notification.findUnique({ where: { id } });
  }

  create(data: CreateNotificationDto) {
    return prisma.notification.create({ data });
  }

  update(id: number, data: UpdateNotificationDto) {
    return prisma.notification.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.notification.delete({ where: { id } });
  }
}
