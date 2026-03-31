import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
import { BookAppointmentDto } from './DTOS/bookAppointmentDTO';
import { CancelAppointmentDto } from './DTOS/cancelAppointmentDTO';
import { RescheduleAppointmentDto } from './DTOS/rescheduleAppointmentDTO';

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

  async bookAppointment(dto: BookAppointmentDto) {
    const { clientId, officeId, timeSlotId } = dto;

    const client = await this.prisma.clientAccount.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundException(`Client with id ${clientId} not found`);

    const office = await this.prisma.office.findUnique({
      where: { id: officeId },
      include: { doctor: true }
    });
    if (!office) throw new NotFoundException(`Office with id ${officeId} not found`);

    const timeSlot = await this.prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
    if (!timeSlot) throw new NotFoundException(`TimeSlot with id ${timeSlotId} not found`);

    if (!timeSlot.startTime || !timeSlot.endTime)
      throw new BadRequestException(`TimeSlot ${timeSlotId} has invalid start/end time`);

    if (timeSlot.officeId !== officeId)
      throw new BadRequestException(`TimeSlot ${timeSlotId} does not belong to office ${officeId}`);

    if (timeSlot.isBooked)
      throw new BadRequestException(`TimeSlot ${timeSlotId} is already booked`);

    if (!office.doctor.isVerified)
      throw new BadRequestException(`Doctor is not verified`);

    const slotDate = new Date(timeSlot.startTime);
    slotDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(slotDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const unavailability = await this.prisma.doctorUnavailability.findFirst({
      where: { doctorId: office.doctorId, date: { gte: slotDate, lt: nextDay } }
    });
    if (unavailability)
      throw new BadRequestException(`Doctor is unavailable on ${slotDate.toDateString()}`);

    const activeStatus = await this.prisma.appointmentStatus.findFirst({
      where: { status: 'ACTIVE' }
    });
    if (!activeStatus)
      throw new NotFoundException(`AppointmentStatus 'ACTIVE' not found in DB`);

    return await this.prisma.$transaction(async (tx) => {
      const freshSlot = await tx.timeSlot.findUnique({ where: { id: timeSlotId } });
      if (!freshSlot || freshSlot.isBooked)
        throw new BadRequestException(`TimeSlot ${timeSlotId} is already booked`);

      const appointment = await tx.appointment.create({
        data: {
          userAccountId: clientId,
          officeId,
          timeSlotId,
          probableStartTime: timeSlot.startTime,
          durationInMinutes: office.timeSlotPerClientInMin,
          appointmentStatusId: activeStatus.id,
          appointmentTakenDate: new Date()
        }
      });

      await tx.timeSlot.update({
        where: { id: timeSlotId },
        data: { isBooked: true }
      });

      return appointment;
    });
  }

  async cancelAppointment(id: number, dto: CancelAppointmentDto) {
    const { reason } = dto;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { status: true }
    });
    if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);

    if (appointment.status.status === 'CANCELLED')
      throw new BadRequestException(`Appointment is already cancelled`);
    if (appointment.status.status === 'COMPLETED')
      throw new BadRequestException(`Cannot cancel a completed appointment`);

    const cancelledStatus = await this.prisma.appointmentStatus.findFirst({
      where: { status: 'CANCELLED' }
    });
    if (!cancelledStatus)
      throw new NotFoundException(`AppointmentStatus 'CANCELLED' not found in DB`);

    return await this.prisma.$transaction(async (tx) => {
      const freshAppointment = await tx.appointment.findUnique({
        where: { id },
        include: { status: true }
      });
      if (!freshAppointment)
        throw new NotFoundException(`Appointment not found`);
      if (freshAppointment.status.status === 'CANCELLED')
        throw new BadRequestException(`Appointment is already cancelled`);
      if (freshAppointment.status.status === 'COMPLETED')
        throw new BadRequestException(`Cannot cancel a completed appointment`);

      const updated = await tx.appointment.update({
        where: { id },
        data: { appointmentStatusId: cancelledStatus.id, cancellationReason: reason },
        include: { status: true, office: true, timeSlot: true }
      });

      await tx.timeSlot.updateMany({
        where: { id: appointment.timeSlotId, isBooked: true },
        data: { isBooked: false }
      });

      return updated;
    });
  }

  async rescheduleAppointment(id: number, dto: RescheduleAppointmentDto) {
    const { newTimeSlotId } = dto;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { status: true, timeSlot: true }
    });
    if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);

    if (appointment.status.status === 'CANCELLED')
      throw new BadRequestException(`Cannot reschedule a cancelled appointment`);
    if (appointment.status.status === 'COMPLETED')
      throw new BadRequestException(`Cannot reschedule a completed appointment`);

    if (appointment.timeSlotId === newTimeSlotId)
      throw new BadRequestException(`New time slot is the same as the current one`);

    const newSlot = await this.prisma.timeSlot.findUnique({ where: { id: newTimeSlotId } });
    if (!newSlot) throw new NotFoundException(`TimeSlot with id ${newTimeSlotId} not found`);

    if (newSlot.isBooked)
      throw new BadRequestException(`TimeSlot ${newTimeSlotId} is already booked`);

    if (newSlot.officeId !== appointment.officeId)
      throw new BadRequestException(`New slot does not belong to the same office`);

    const slotDate = new Date(newSlot.startTime);
    slotDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(slotDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const office = await this.prisma.office.findUnique({ where: { id: appointment.officeId } });
    if (!office) throw new NotFoundException(`Office with id ${appointment.officeId} not found`);

    const unavailability = await this.prisma.doctorUnavailability.findFirst({
      where: { doctorId: office.doctorId, date: { gte: slotDate, lt: nextDay } }
    });
    if (unavailability)
      throw new BadRequestException(`Doctor is unavailable on ${slotDate.toDateString()}`);

    return await this.prisma.$transaction(async (tx) => {
      const freshAppointment = await tx.appointment.findUnique({
        where: { id },
        include: { status: true }
      });
      if (!freshAppointment)
        throw new NotFoundException(`Appointment not found`);
      if (freshAppointment.status.status === 'CANCELLED')
        throw new BadRequestException(`Cannot reschedule a cancelled appointment`);
      if (freshAppointment.status.status === 'COMPLETED')
        throw new BadRequestException(`Cannot reschedule a completed appointment`);

      const freshNewSlot = await tx.timeSlot.findUnique({ where: { id: newTimeSlotId } });
      if (!freshNewSlot || freshNewSlot.isBooked)
        throw new BadRequestException(`TimeSlot ${newTimeSlotId} is already booked`);

      await tx.appointmentHistory.create({
        data: { appointmentId: id, oldTimeSlotId: appointment.timeSlotId, newTimeSlotId }
      });

      const updated = await tx.appointment.update({
        where: { id },
        data: { timeSlotId: newTimeSlotId, probableStartTime: freshNewSlot.startTime },
        include: { status: true, timeSlot: true, office: true }
      });

      await tx.timeSlot.updateMany({
        where: { id: appointment.timeSlotId, isBooked: true },
        data: { isBooked: false }
      });

      const bookedSlot = await tx.timeSlot.updateMany({
        where: { id: newTimeSlotId, isBooked: false },
        data: { isBooked: true }
      });
      if (bookedSlot.count === 0)
        throw new BadRequestException(`TimeSlot ${newTimeSlotId} is already booked`);

      return updated;
    });
  }

  async getClientAppointments(clientId: number) {
    const client = await this.prisma.clientAccount.findUnique({ where: { id: clientId } });
    if (!client) throw new NotFoundException(`Client with id ${clientId} not found`);

    return this.prisma.appointment.findMany({
      where: { userAccountId: clientId },
      include: {
        office: { include: { doctor: true } },
        timeSlot: true,
        status: true
      }
    });
  }

  async getDoctorAppointments(doctorId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException(`Doctor with id ${doctorId} not found`);

    return this.prisma.appointment.findMany({
      where: { office: { doctorId } },
      include: {
        client: true,
        timeSlot: true,
        status: true,
        office: true
      }
    });
  }

  async getAppointmentDetails(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        office: { include: { doctor: true } },
        timeSlot: true,
        status: true
      }
    });
    if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);
    return appointment;
  }

  async getAppointmentHistory(id: number) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);

    return this.prisma.appointmentHistory.findMany({
      where: { appointmentId: id }
    });
  }
}
