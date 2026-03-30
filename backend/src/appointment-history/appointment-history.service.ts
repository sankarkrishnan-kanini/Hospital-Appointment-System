import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';

@Injectable()
export class AppointmentHistoryService {

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.appointmentHistory.findMany();
  }

  findOne(id: number) {
    return this.prisma.appointmentHistory.findUnique({
      where: { id }
    });

  }

  create(data: CreateAppointmentHistoryDto) {
    return this.prisma.appointmentHistory.create({ data });
  }

  update(id: number, data: UpdateAppointmentHistoryDto) {
    return this.prisma.appointmentHistory.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return this.prisma.appointmentHistory.delete({
      where: { id }
    });

  }
}
