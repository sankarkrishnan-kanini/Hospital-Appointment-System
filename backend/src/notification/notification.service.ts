import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';

@Injectable()
export class NotificationService {

    constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.notification.findMany();
  }

  findOne(id: number) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  create(data: CreateNotificationDto) {
    return this.prisma.notification.create({ data });
  }


  update(id: number, data: UpdateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data });

  }

  remove(id: number) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
