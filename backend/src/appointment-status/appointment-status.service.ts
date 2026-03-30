import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';
import { UpdateAppointmentStatusDto } from './DTOS/updateAppointmentStatusDTO';

@Injectable()
export class AppointmentStatusService {

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.appointmentStatus.findMany();
  }

  findOne(id: number) {
    return this.prisma.appointmentStatus.findUnique({ where: { id } });
  }

  create(data: CreateAppointmentStatusDto) {
    return this.prisma.appointmentStatus.create({ data });
  }

  update(id: number, data: UpdateAppointmentStatusDto) {
    return this.prisma.appointmentStatus.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.appointmentStatus.delete({ where: { id } });
  }
}
