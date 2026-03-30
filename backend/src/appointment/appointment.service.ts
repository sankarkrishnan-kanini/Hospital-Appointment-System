import { Injectable } from '@nestjs/common';
import { PrismaService  } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
@Injectable()
export class AppointmentService {

  constructor(private readonly prisma:PrismaService){}

    // GET all appointments
  findAll() {
    return this.prisma.appointment.findMany();
  }

  // GET one appointment by id
  findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id }
    });
  }

  // POST create appointment
  create(data: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data
    });
  }

  // PATCH update appointment
  update(id: number, data: Partial<CreateAppointmentDto>) {
    return this.prisma.appointment.update({
      where: { id },
      data
    });
  }

  // DELETE appointment
  remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id }
    });
  }


}
