import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';

@Injectable()
export class AppointmentHistoryService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.appointmentHistory.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.appointmentHistory.findUnique({ where: { id } });
  }

  async create(data: CreateAppointmentHistoryDto) {
    return await this.prisma.appointmentHistory.create({ data });
  }

  async update(id: number, data: UpdateAppointmentHistoryDto) {
    return await this.prisma.appointmentHistory.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.appointmentHistory.delete({ where: { id } });
  }
}
