import { Injectable } from '@nestjs/common';
import {prisma} from '../adaptor'
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
@Injectable()
export class AppointmentService {


    // GET all appointments
  findAll() {
    return prisma.appointment.findMany();
  }

  // GET one appointment by id
  findOne(id: number) {
    return prisma.appointment.findUnique({
      where: { id }
    });
  }

  // POST create appointment
  create(data: CreateAppointmentDto) {
    return prisma.appointment.create({
      data
    });
  }

  // PATCH update appointment
  update(id: number, data: UpdateAppointmentDto) {
    return prisma.appointment.update({
      where: { id },
      data
    });
  }

  // DELETE appointment
  remove(id: number) {
    return prisma.appointment.delete({
      where: { id }
    });
  }


}
