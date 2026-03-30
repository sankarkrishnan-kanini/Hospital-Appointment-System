import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';

@Injectable()
export class AppointmentService {

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.appointment.findMany();
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({ where: { id } });
  }

  create(data: CreateAppointmentDto) {
    return this.prisma.appointment.create({ data });
  }

  update(id: number, data: UpdateAppointmentDto) {
    return this.prisma.appointment.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.appointment.delete({ where: { id } });
  }
}
