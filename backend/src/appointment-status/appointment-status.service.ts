import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';

@Injectable()
export class AppointmentStatusService {

  findAll() {
    return prisma.appointmentStatus.findMany();
  }

  findOne(id: number) {
    return prisma.appointmentStatus.findUnique({
      where: { id }
    });
  }

  create(data: CreateAppointmentStatusDto) {
    return prisma.appointmentStatus.create({ data });
  }

  update(id: number, data: Partial<CreateAppointmentStatusDto>) {
    return prisma.appointmentStatus.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return prisma.appointmentStatus.delete({
      where: { id }
    });
  }
}
