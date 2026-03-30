import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';

@Injectable()
export class AppointmentService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.appointment.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.appointment.findUnique({ where: { id } });
  }

  async create(data: CreateAppointmentDto) {
    return await this.prisma.appointment.create({ data });
  }

  async update(id: number, data: UpdateAppointmentDto) {
    return await this.prisma.appointment.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.appointment.delete({ where: { id } });
  }
}
