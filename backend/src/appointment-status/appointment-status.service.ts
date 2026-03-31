import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';
import { UpdateAppointmentStatusDto } from './DTOS/updateAppointmentStatusDTO';

@Injectable()
export class AppointmentStatusService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.appointmentStatus.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.appointmentStatus.findUnique({ where: { id } });
  }

  async create(data: CreateAppointmentStatusDto) {
    return await this.prisma.appointmentStatus.create({ data });
  }

  async update(id: number, data: UpdateAppointmentStatusDto) {
    return await this.prisma.appointmentStatus.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.appointmentStatus.delete({ where: { id } });
  }
}
