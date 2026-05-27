import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDto';
import { SearchDoctorsDto } from './DTOS/searchDoctorsDto';
import { BookAppointmentDto } from './DTOS/bookAppointmentDto';
import { CancelAppointmentDto } from './DTOS/cancelAppointmentDto';
import { RescheduleAppointmentDto } from './DTOS/rescheduleAppointmentDto';
import { NotificationService } from '../notification-module/notification.service';
import { AppointmentHistoryService } from '../appointment-history/appointment-history.service';
import { MailService } from '../mail/mail.service';


@Injectable()
export class PatientService {

  constructor(
    private readonly prisma: PrismaService,

    @Inject(CACHE_MANAGER) private readonly cache: Cache,

    private readonly notificationService: NotificationService,
    private readonly appointmentHistoryService: AppointmentHistoryService,
    private readonly mailService: MailService,
  ) {}


  async getSpecializations() {
    return this.prisma.specialization.findMany({ orderBy: { id: 'asc' } });
  }

  // ─── CREATE CLIENT ACCOUNT ────────────────────────────────────────────────────


  async createClientAccount(userId: number, dto: CreateClientAccountDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User not found`);
    if (user.role !== 'patient') throw new BadRequestException(`User does not have patient role`);

    const existing = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException(`Client account already exists`);

    return this.prisma.clientAccount.create({
      data: {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        contactNumber: dto.contactNumber,
        email: dto.email
      }
    });
  }

  async getClientAccount(userId: number) {
    const client = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException(`Client account not found`);
    return client;
  }

  async searchDoctors(dto: SearchDoctorsDto) {
    const cacheKey = `searchDoctors:${JSON.stringify(dto)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const andConditions: any[] = [{ isVerified: true }];

    if (dto.specializationId) {
      andConditions.push({ specializations: { some: { specializationId: dto.specializationId } } });
    }

    // Build practice-level filter
    if (dto.city || dto.maxFee || dto.insurance) {
      const practiceConditions: any[] = [];

      if (dto.city) {
        practiceConditions.push({
          OR: [
            { city: { contains: dto.city } },
            { hospital: { city: { contains: dto.city } } }
          ]
        });
      }
      if (dto.maxFee) {
        practiceConditions.push({ firstConsultationFee: { lte: Number(dto.maxFee) } });
      }
      if (dto.insurance) {
        practiceConditions.push({
          insurances: { some: { insuranceName: { contains: dto.insurance } } }
        });
      }

      andConditions.push({
        doctorHospitals: {
          some: practiceConditions.length === 1
            ? practiceConditions[0]
            : { AND: practiceConditions }
        }
      });
    }

    const doctors = await this.prisma.doctor.findMany({
      where: { AND: andConditions },
      include: {
        specializations: { include: { specialization: true } },
        doctorHospitals: {
          include: { hospital: { include: { office: true } }, insurances: true }
        }
      }
    });

    const result = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specializations: doctor.specializations.map(ds => ds.specialization.specializationName),
      practices: doctor.doctorHospitals.map(dh => ({
        doctorHospitalId: dh.id,
        isPrivate: dh.isPrivate,
        firstConsultationFee: dh.firstConsultationFee,
        followupConsultationFee: dh.followupConsultationFee,
        timeSlotPerClientInMin: dh.timeSlotPerClientInMin,
        insurances: dh.insurances.map(i => i.insuranceName),
        city: dh.isPrivate ? dh.city : dh.hospital?.city,
        hospital: dh.isPrivate ? null : { name: dh.hospital?.name, city: dh.hospital?.city }
      }))
    }));
    await this.cache.set(cacheKey, result);
    return result;
  }

  async getDoctorProfile(doctorId: number) {
    const cacheKey = `doctorProfile:${doctorId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId, isVerified: true },
      include: {
        specializations: { include: { specialization: true } },
        qualifications: true,
        doctorHospitals: {
          include: { hospital: { include: { office: true } }, insurances: true }
        }
      }
    });
    if (!doctor) throw new NotFoundException(`Doctor with id ${doctorId} not found`);

    const result = {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      professionalStatement: doctor.professionalStatement,
      practicingFrom: doctor.practicingFrom,
      specializations: doctor.specializations.map(ds => ds.specialization.specializationName),
      qualifications: doctor.qualifications.map(q => ({
        name: q.qualificationName,
        institute: q.instituteName,
        year: q.procurementYear
      })),
      practices: doctor.doctorHospitals.map(dh => ({
        doctorHospitalId: dh.id,
        isPrivate: dh.isPrivate,
        firstConsultationFee: dh.firstConsultationFee,
        followupConsultationFee: dh.followupConsultationFee,
        timeSlotPerClientInMin: dh.timeSlotPerClientInMin,
        insurances: dh.insurances.map(i => i.insuranceName),
        ...(dh.isPrivate
          ? { streetAddress: dh.streetAddress, city: dh.city, state: dh.state, country: dh.country, zip: dh.zip }
          : { hospital: { name: dh.hospital?.name, city: dh.hospital?.city, state: dh.hospital?.state } }
        )
      }))
    };
    await this.cache.set(cacheKey, result);
    return result;
  }

  async getAvailableTimeSlots(doctorId: number, doctorHospitalId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId, isVerified: true } });
    if (!doctor) throw new NotFoundException(`Doctor with id ${doctorId} not found`);

    const doctorHospital = await this.prisma.doctorHospital.findUnique({ where: { id: doctorHospitalId } });
    if (!doctorHospital) throw new NotFoundException(`Practice with id ${doctorHospitalId} not found`);
    if (doctorHospital.doctorId !== doctorId) throw new BadRequestException(`This practice does not belong to this doctor`);

    // Start of today in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const slots = await this.prisma.timeSlot.findMany({
      where: {
        doctorHospitalId,
        isBooked: false,
        startTime: { gte: todayStart },
      },
      orderBy: { startTime: 'asc' },
    });

  
    const grouped: Record<string, typeof slots> = {};
    for (const slot of slots) {
      const dateKey = slot.startTime.toISOString().split('T')[0]; 
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(slot);
    }

    return Object.entries(grouped).map(([date, daySlots]) => ({
      date,
      slots: daySlots,
    }));
  }

 

  async bookAppointment(userId: number, dto: BookAppointmentDto) {
    const client = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException(`Client account not found. Please create one first`);

   
    const specialization = await this.prisma.specialization.findUnique({ where: { id: dto.specializationId } });
    if (!specialization) throw new NotFoundException(`Specialization with id ${dto.specializationId} not found`);

    
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
      include: { specializations: true }
    });
    if (!doctor) throw new NotFoundException(`Doctor with id ${dto.doctorId} not found`);
    if (!doctor.isVerified) throw new BadRequestException(`Doctor is not verified`);
    const hasSpecialization = doctor.specializations.some(s => s.specializationId === dto.specializationId);
    if (!hasSpecialization) throw new BadRequestException(`Doctor does not have the selected specialization`);

    
    const doctorHospital = await this.prisma.doctorHospital.findUnique({
      where: { id: dto.doctorHospitalId },
      include: { hospital: true }
    });
    if (!doctorHospital) throw new NotFoundException(`Practice with id ${dto.doctorHospitalId} not found`);
    if (doctorHospital.doctorId !== dto.doctorId) throw new BadRequestException(`This practice does not belong to the selected doctor`);

   
    const timeSlot = await this.prisma.timeSlot.findUnique({ where: { id: dto.timeSlotId } });
    if (!timeSlot) throw new NotFoundException(`TimeSlot with id ${dto.timeSlotId} not found`);
    if (timeSlot.doctorHospitalId !== dto.doctorHospitalId) throw new BadRequestException(`TimeSlot does not belong to this practice`);
    if (timeSlot.isBooked) throw new BadRequestException(`TimeSlot is already booked`);
    if (timeSlot.startTime <= new Date()) throw new BadRequestException(`Cannot book a past time slot`);

    
    const slotDate = new Date(timeSlot.startTime);
    slotDate.setUTCHours(0, 0, 0, 0);
    const slotEnd = new Date(timeSlot.endTime);

    const unavailability = await this.prisma.doctorUnavailability.findFirst({
      where: {
        doctorId: dto.doctorId,
        date: slotDate,
        OR: [
          { startTime: null },
          { startTime: { lte: timeSlot.startTime }, endTime: { gte: slotEnd } }
        ]
      }
    });
    if (unavailability) throw new BadRequestException(`Doctor is unavailable at this time`);

    const activeStatus = await this.prisma.appointmentStatus.findFirst({ where: { status: 'ACTIVE' } });
    if (!activeStatus) throw new NotFoundException(`AppointmentStatus 'ACTIVE' not found in DB`);

    const completedStatus = await this.prisma.appointmentStatus.findFirst({ where: { status: 'Completed' } });
    const hasPriorVisit = completedStatus ? await this.prisma.appointment.findFirst({
      where: {
        userAccountId: client.id,
        doctorHospital: { doctorId: dto.doctorId },
        appointmentStatusId: completedStatus.id,
      }
    }) : null;
    const consultationFee = hasPriorVisit
      ? doctorHospital.followupConsultationFee
      : doctorHospital.firstConsultationFee;

    const appointment = await this.prisma.$transaction(async (tx) => {
      const freshSlot = await tx.timeSlot.findUnique({ where: { id: dto.timeSlotId } });
      if (!freshSlot || freshSlot.isBooked) throw new BadRequestException(`TimeSlot is already booked`);

      const created = await tx.appointment.create({
        data: {
          userAccountId: client.id,
          doctorHospitalId: dto.doctorHospitalId,
          timeSlotId: dto.timeSlotId,
          probableStartTime: timeSlot.startTime,
          durationInMinutes: doctorHospital.timeSlotPerClientInMin,
          appointmentStatusId: activeStatus.id,
          appointmentTakenDate: new Date(),
          consultationFee: consultationFee ?? 0,
        },
      });

      await tx.timeSlot.update({ where: { id: dto.timeSlotId }, data: { isBooked: true } });

      return created;
    });

    const hospitalName = doctorHospital.isPrivate ? 'Private Practice' : (doctorHospital.hospital?.name || 'Hospital');

    await this.notificationService.notifyAppointmentBooked(
      client.userId,
      doctor.userId,
      `${doctor.firstName} ${doctor.lastName}`,
      `${client.firstName} ${client.lastName}`,
      hospitalName,
      appointment.probableStartTime
    );

    await this.mailService.sendAppointmentBookedToPatient(
      client.email,
      `${client.firstName} ${client.lastName}`,
      `${doctor.firstName} ${doctor.lastName}`,
      hospitalName,
      appointment.probableStartTime,
      appointment.id,
      consultationFee,
    ).catch(() => {});

    const doctorUser = await this.prisma.user.findUnique({ where: { id: doctor.userId }, select: { email: true } });
    if (doctorUser) {
      await this.mailService.sendAppointmentBookedToDoctor(
        doctorUser.email,
        `${doctor.firstName} ${doctor.lastName}`,
        `${client.firstName} ${client.lastName}`,
        appointment.probableStartTime,
        appointment.id,
      ).catch(() => {});
    }

    return {
      id: appointment.id,
      reason: dto.reason,
      consultationFee,
      isFollowup: !!hasPriorVisit,
      probableStartTime: appointment.probableStartTime,
      durationInMinutes: appointment.durationInMinutes,
      appointmentTakenDate: appointment.appointmentTakenDate,
      status: activeStatus.status,
      specialization: specialization.specializationName,
      timeSlot: {
        id: timeSlot.id,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime
      },
      doctor: {
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName
      },
      practice: {
        doctorHospitalId: doctorHospital.id,
        isPrivate: doctorHospital.isPrivate,
        ...(doctorHospital.isPrivate
          ? { address: `${doctorHospital.streetAddress}, ${doctorHospital.city}` }
          : { hospital: doctorHospital.hospital?.name, city: doctorHospital.hospital?.city }
        )
      }
    };
  }


  async cancelAppointment(userId: number, appointmentId: number, dto: CancelAppointmentDto) {
    const client = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException(`Client account not found`);

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { status: true }
    });
    if (!appointment) throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    if (appointment.userAccountId !== client.id) throw new BadRequestException(`This appointment does not belong to you`);
    if (appointment.status.status === 'CANCELLED') throw new BadRequestException(`Appointment is already cancelled`);
    if (appointment.status.status === 'Completed') throw new BadRequestException(`Cannot cancel a completed appointment`);

    const cancelledStatus = await this.prisma.appointmentStatus.findFirst({ where: { status: 'CANCELLED' } });
    if (!cancelledStatus) throw new NotFoundException(`AppointmentStatus 'CANCELLED' not found in DB`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { appointmentStatusId: cancelledStatus.id, cancellationReason: dto.reason },
        include: { status: true, timeSlot: true, doctorHospital: { include: { doctor: true } } }
      });
      await tx.timeSlot.update({ where: { id: appointment.timeSlotId }, data: { isBooked: false } });

   
      await this.notificationService.notifyAppointmentCancelledByPatient(
        client.userId,
        updated.doctorHospital.doctor.userId,
        `${updated.doctorHospital.doctor.firstName} ${updated.doctorHospital.doctor.lastName}`,
        `${client.firstName} ${client.lastName}`,
        updated.timeSlot.startTime
      );

      return updated;
    });
  }

  async rescheduleAppointment(userId: number, appointmentId: number, dto: RescheduleAppointmentDto) {
    const client = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException(`Client account not found`);

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { status: true }
    });
    if (!appointment) throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
    if (appointment.userAccountId !== client.id) throw new BadRequestException(`This appointment does not belong to you`);
    if (appointment.status.status === 'CANCELLED') throw new BadRequestException(`Cannot reschedule a cancelled appointment`);
    if (appointment.status.status === 'Completed') throw new BadRequestException(`Cannot reschedule a completed appointment`);
    if (appointment.timeSlotId === dto.newTimeSlotId) throw new BadRequestException(`New time slot is the same as current`);

    const newSlot = await this.prisma.timeSlot.findUnique({ where: { id: dto.newTimeSlotId } });
    if (!newSlot) throw new NotFoundException(`TimeSlot with id ${dto.newTimeSlotId} not found`);
    if (newSlot.isBooked) throw new BadRequestException(`TimeSlot is already booked`);
    if (newSlot.doctorHospitalId !== appointment.doctorHospitalId) throw new BadRequestException(`New slot does not belong to the same practice`);
    if (newSlot.startTime <= new Date()) throw new BadRequestException(`Cannot reschedule to a past time slot`);

    return this.prisma.$transaction(async (tx) => {
      const freshNewSlot = await tx.timeSlot.findUnique({ where: { id: dto.newTimeSlotId } });
      if (!freshNewSlot || freshNewSlot.isBooked) throw new BadRequestException(`TimeSlot is already booked`);

      await tx.appointmentHistory.create({
        data: { appointmentId, oldTimeSlotId: appointment.timeSlotId, newTimeSlotId: dto.newTimeSlotId }
      });

      const updated = await tx.appointment.update({
        where: { id: appointmentId },
        data: { timeSlotId: dto.newTimeSlotId, probableStartTime: freshNewSlot.startTime },
        include: { status: true, timeSlot: true, doctorHospital: { include: { doctor: true } } }
      });

      await tx.timeSlot.update({ where: { id: appointment.timeSlotId }, data: { isBooked: false } });
      await tx.timeSlot.updateMany({ where: { id: dto.newTimeSlotId, isBooked: false }, data: { isBooked: true } });

     
      await this.notificationService.notifyAppointmentRescheduled(
        client.userId,
        updated.doctorHospital.doctor.userId,
        `${updated.doctorHospital.doctor.firstName} ${updated.doctorHospital.doctor.lastName}`,
        `${client.firstName} ${client.lastName}`,
        freshNewSlot.startTime
      );

      return updated;
    });
  }

  async getOwnAppointments(userId: number) {
    const client = await this.prisma.clientAccount.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException(`Client account not found`);

    return this.prisma.appointment.findMany({
      where: { userAccountId: client.id },
      include: {
        doctorHospital: { include: { doctor: true, hospital: true } },
        timeSlot: true,
        status: true
      },
      orderBy: { probableStartTime: 'desc' }
    });
  }

  

  async getAppointmentHistory(userId: number, appointmentId: number) {
    return this.appointmentHistoryService.findByAppointment(userId, appointmentId);
  }
}
