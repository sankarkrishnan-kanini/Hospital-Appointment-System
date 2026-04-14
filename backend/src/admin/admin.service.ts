import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification-module/notification.service';

@Injectable()
export class AdminService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly notificationService: NotificationService
  ) {}

  // ─── USER MANAGEMENT ─────────────────────────────────────────────────────────

  async getAllUsers() {
    const cached = await this.cache.get('admin:users');
    if (cached) return cached;
    const users = await this.prisma.user.findMany();
    const result = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }));
    await this.cache.set('admin:users', result);
    return result;
  }

  async deactivateUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (!user.isActive) throw new BadRequestException(`User with id ${id} is already deactivated`);

    const updated = await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    await this.cache.del('admin:users');
    return { id: updated.id, email: updated.email, role: updated.role, isActive: updated.isActive };
  }

  async activateUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (user.isActive) throw new BadRequestException(`User with id ${id} is already active`);

    const updated = await this.prisma.user.update({ where: { id }, data: { isActive: true } });
    await this.cache.del('admin:users');
    return { id: updated.id, email: updated.email, role: updated.role, isActive: updated.isActive };
  }

  // ─── DOCTOR MANAGEMENT ───────────────────────────────────────────────────────

  async getAllDoctors() {
    const cached = await this.cache.get('admin:doctors');
    if (cached) return cached;
    const doctors = await this.prisma.doctor.findMany({
      include: {
        specializations: { include: { specialization: true } },
        doctorHospitals: true,
        documents: true
      }
    });

    const result = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      practicingFrom: doctor.practicingFrom,
      isVerified: doctor.isVerified,
      verificationRequested: doctor.verificationRequested,
      documentCount: doctor.documents.length,
      specializations: doctor.specializations.map(ds => ds.specialization.specializationName),
      doctorHospitals: doctor.doctorHospitals
    }));
    await this.cache.set('admin:doctors', result);
    return result;
  }

  async getPendingDoctors() {
    const cached = await this.cache.get('admin:doctors:pending');
    if (cached) return cached;
    const doctors = await this.prisma.doctor.findMany({
      where: { verificationRequested: true, isVerified: false },
      include: {
        specializations: { include: { specialization: true } },
        documents: true,
        doctorHospitals: true
      }
    });

    const result = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      practicingFrom: doctor.practicingFrom,
      isVerified: doctor.isVerified,
      verificationRequested: doctor.verificationRequested,
      documentCount: doctor.documents.length,
      specializations: doctor.specializations.map(ds => ds.specialization.specializationName),
      doctorHospitals: doctor.doctorHospitals
    }));
    await this.cache.set('admin:doctors:pending', result);
    return result;
  }

  async getDoctorById(id: number) {
    const cacheKey = `admin:doctor:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        specializations: { include: { specialization: true } },
        doctorHospitals: { include: { hospital: true } },
        documents: true,
        qualifications: true
      }
    });
    if (!doctor) throw new NotFoundException(`Doctor with id ${id} not found`);

    const result = {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      professionalStatement: doctor.professionalStatement,
      practicingFrom: doctor.practicingFrom,
      isVerified: doctor.isVerified,
      verificationRequested: doctor.verificationRequested,
      specializations: doctor.specializations.map(ds => ds.specialization.specializationName),
      doctorHospitals: doctor.doctorHospitals,
      documentCount: doctor.documents.length,
      documents: doctor.documents.map(d => ({
        id: d.id,
        documentType: d.documentType,
        uploadedAt: d.uploadedAt
      })),
      qualifications: doctor.qualifications.map(q => ({
        name: q.qualificationName,
        institute: q.instituteName,
        year: q.procurementYear
      }))
    };
    await this.cache.set(cacheKey, result);
    return result;
  }

  async getDoctorDocument(doctorId: number, docId: number) {
    const doc = await this.prisma.doctorDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException(`Document not found`);
    if (doc.doctorId !== doctorId) throw new NotFoundException(`Document does not belong to this doctor`);
    return { buffer: Buffer.isBuffer(doc.fileUrl) ? doc.fileUrl : Buffer.from(doc.fileUrl), documentType: doc.documentType };
  }

  async verifyDoctor(id: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, isVerified: true, verificationRequested: true, documents: true, userId: true }
    });
    if (!doctor) throw new NotFoundException(`Doctor with id ${id} not found`);
    if (doctor.isVerified) throw new BadRequestException(`Doctor with id ${id} is already verified`);
    if (!doctor.verificationRequested) throw new BadRequestException(`Doctor has not requested verification yet`);
    if (doctor.documents.length === 0) throw new BadRequestException(`Doctor must upload documents before verification`);

    const updated = await this.prisma.doctor.updateMany({ where: { id, isVerified: false }, data: { isVerified: true } });
    if (updated.count === 0) throw new BadRequestException(`Doctor is already verified`);

    // Notify doctor
    const doctorUser = await this.prisma.user.findUnique({ where: { id: doctor.userId } });
    if (doctorUser) await this.notificationService.notifyDoctorVerified(doctorUser.id);
    await this.cache.del(`admin:doctor:${id}`);
    await this.cache.del('admin:doctors');
    await this.cache.del('admin:doctors:pending');
    return { id: doctor.id, firstName: doctor.firstName, lastName: doctor.lastName, isVerified: true, verifiedAt: new Date() };
  }

  // ─── APPOINTMENT MANAGEMENT ──────────────────────────────────────────────────

  async getAllAppointments() {
    return this.prisma.appointment.findMany({
      include: {
        client: true,
        doctorHospital: { include: { doctor: true, hospital: true } },
        timeSlot: true,
        status: true
      }
    });
  }

  async getAppointmentById(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        doctorHospital: { include: { doctor: true, hospital: true } },
        timeSlot: true,
        status: true,
        history: true
      }
    });
    if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);
    return appointment;
  }

  // ─── PATIENT MANAGEMENT ──────────────────────────────────────────────────────

  async getAllPatients() {
    const cached = await this.cache.get('admin:patients');
    if (cached) return cached;
    const patients = await this.prisma.clientAccount.findMany({ include: { user: true } });
    const result = patients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      contactNumber: patient.contactNumber,
      isActive: patient.user.isActive
    }));
    await this.cache.set('admin:patients', result);
    return result;
  }

  async getPatientById(id: number) {
    const cacheKey = `admin:patient:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    const patient = await this.prisma.clientAccount.findUnique({
      where: { id },
      include: {
        user: true,
        appointments: {
          include: {
            status: true,
            timeSlot: true,
            doctorHospital: { include: { doctor: true, hospital: true } }
          }
        }
      }
    });
    if (!patient) throw new NotFoundException(`Patient with id ${id} not found`);

    const result = {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      contactNumber: patient.contactNumber,
      isActive: patient.user.isActive,
      appointments: patient.appointments
    };
    await this.cache.set(cacheKey, result);
    return result;
  }

  // ─── SPECIALIZATION REQUESTS ─────────────────────────────────────────────────

  async getSpecializationRequests() {
    const cached = await this.cache.get('admin:specialization-requests');
    if (cached) return cached;
    const documents = await this.prisma.doctorDocument.findMany({
      where: { documentType: { startsWith: 'SPECIALIZATION_REQUEST_' } },
      include: { doctor: true }
    });

    const result = documents.map(doc => ({
      documentId: doc.id,
      doctorId: doc.doctorId,
      doctorName: `${doc.doctor.firstName} ${doc.doctor.lastName}`,
      specializationId: parseInt(doc.documentType.replace('SPECIALIZATION_REQUEST_', '')),
      uploadedAt: doc.uploadedAt
    }));
    await this.cache.set('admin:specialization-requests', result);
    return result;
  }

  async approveSpecialization(doctorId: number, specializationId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException(`Doctor not found`);

    const specialization = await this.prisma.specialization.findUnique({ where: { id: specializationId } });
    if (!specialization) throw new NotFoundException(`Specialization not found`);

    const requestDoc = await this.prisma.doctorDocument.findFirst({
      where: { doctorId, documentType: `SPECIALIZATION_REQUEST_${specializationId}` }
    });
    if (!requestDoc) throw new BadRequestException(`No specialization request found for this doctor and specialization`);

    const existing = await this.prisma.doctorSpecialization.findFirst({ where: { doctorId, specializationId } });
    if (existing) throw new BadRequestException(`Doctor already has this specialization`);

    const result = await this.prisma.doctorSpecialization.create({ data: { doctorId, specializationId } });
    await this.notificationService.notifySpecializationApproved(doctor.userId, specialization.specializationName);
    await this.cache.del('admin:specialization-requests');
    await this.cache.del(`admin:doctor:${doctorId}`);
    await this.cache.del('admin:doctors');
    return result;
  }

  async rejectSpecialization(doctorId: number, specializationId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException(`Doctor not found`);

    const specialization = await this.prisma.specialization.findUnique({ where: { id: specializationId } });
    if (!specialization) throw new NotFoundException(`Specialization not found`);

    const requestDoc = await this.prisma.doctorDocument.findFirst({
      where: { doctorId, documentType: `SPECIALIZATION_REQUEST_${specializationId}` }
    });
    if (!requestDoc) throw new BadRequestException(`No specialization request found for this doctor and specialization`);

    await this.prisma.doctorDocument.delete({ where: { id: requestDoc.id } });
    await this.notificationService.notifySpecializationRejected(doctor.userId, specialization.specializationName);
    await this.cache.del('admin:specialization-requests');
    await this.cache.del(`admin:doctor:${doctorId}`);
    return { message: `Specialization request rejected and document removed for doctor ${doctorId}` };
  }
}
