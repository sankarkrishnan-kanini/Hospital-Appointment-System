import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';

@Injectable()
export class AppointmentHistoryService {

  findAll() {
    return prisma.appointmentHistory.findMany();
  }

  findOne(id: number) {
    return prisma.appointmentHistory.findUnique({
      where: { id }
    });
  }

  create(data: CreateAppointmentHistoryDto) {
    return prisma.appointmentHistory.create({ data });
  }

  update(id: number, data: UpdateAppointmentHistoryDto) {
    return prisma.appointmentHistory.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return prisma.appointmentHistory.delete({
      where: { id }
    });
  }
}
