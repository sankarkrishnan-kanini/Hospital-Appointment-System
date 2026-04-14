import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification-module/notification.service';

@Injectable()
export class AdminService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  // ─── USER MANAGEMENT ─────────────────────────────────────────────────────────

  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    }));
  }

  async deactivateUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (!user.isActive) throw new BadRequestException(`User with id ${id} is already deactivated`);

    const updated = await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { id: updated.id, email: updated.email, role: updated.role, isActive: updated.isActive };
  }

  async activateUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (user.isActive) throw new BadRequestException(`User with id ${id} is already active`);

    const updated = await this.prisma.user.update({ where: { id }, data: { isActive: true } });
    return { id: updated.id, email: updated.email, role: updated.role, isActive: updated.isActive };
  }

  // ─── DOCTOR MANAGEMENT ───────────────────────────────────────────────────────

  async getAllDoctors() {
    const doctors = await this.prisma.doctor.findMany({
      include: {
        specializations: { include: { specialization: true } },
        doctorHospitals: true,
        documents: true
      }
    });

    return doctors.map(doctor => ({
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
  }

  async getPendingDoctors() {
    const doctors = await this.prisma.doctor.findMany({
      where: { verificationRequested: true, isVerified: false },
      include: {
        specializations: { include: { specialization: true } },
        documents: true,
        doctorHospitals: true
      }
    });

    return doctors.map(doctor => ({
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
  }

  async getDoctorById(id: number) {
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

    return {
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
    const patients = await this.prisma.clientAccount.findMany({ include: { user: true } });
    return patients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      contactNumber: patient.contactNumber,
      isActive: patient.user.isActive
    }));
  }

  async getPatientById(id: number) {
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

    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      contactNumber: patient.contactNumber,
      isActive: patient.user.isActive,
      appointments: patient.appointments
    };
  }

  // ─── SPECIALIZATION REQUESTS ─────────────────────────────────────────────────

  async getSpecializationRequests() {
    const documents = await this.prisma.doctorDocument.findMany({
      where: { documentType: { startsWith: 'SPECIALIZATION_REQUEST_' } },
      include: { doctor: true }
    });

    return documents.map(doc => ({
      documentId: doc.id,
      doctorId: doc.doctorId,
      doctorName: `${doc.doctor.firstName} ${doc.doctor.lastName}`,
      specializationId: parseInt(doc.documentType.replace('SPECIALIZATION_REQUEST_', '')),
      uploadedAt: doc.uploadedAt
    }));
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
    return { message: `Specialization request rejected and document removed for doctor ${doctorId}` };
  }

  // ─── ANALYTICS ───────────────────────────────────────────────────────────────

  async getAnalytics() {
    const [appointments, doctors, patients, users] = await Promise.all([
      this.prisma.appointment.findMany({
        include: {
          status: true,
          doctorHospital: {
            include: {
              doctor: { include: { specializations: { include: { specialization: true } } } }
            }
          }
        }
      }),
      this.prisma.doctor.findMany(),
      this.prisma.clientAccount.findMany(),
      this.prisma.user.findMany()
    ]);

    // 1. Appointments per month (last 6 months)
    const monthMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthMap[key] = 0;
    }
    appointments.forEach(a => {
      const d = new Date(a.appointmentTakenDate);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (key in monthMap) monthMap[key]++;
    });
    const appointmentsPerMonth = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

    // 2. Appointment status breakdown
    const statusMap: Record<string, number> = {};
    appointments.forEach(a => {
      const s = a.status?.status ?? 'Unknown';
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

    // 3. Top doctors by appointment count
    const doctorMap: Record<string, number> = {};
    appointments.forEach(a => {
      const name = `Dr. ${a.doctorHospital.doctor.firstName} ${a.doctorHospital.doctor.lastName}`;
      doctorMap[name] = (doctorMap[name] || 0) + 1;
    });
    const topDoctors = Object.entries(doctorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Top specializations booked
    const specMap: Record<string, number> = {};
    appointments.forEach(a => {
      a.doctorHospital.doctor.specializations.forEach(s => {
        const name = s.specialization.specializationName;
        specMap[name] = (specMap[name] || 0) + 1;
      });
    });
    const topSpecializations = Object.entries(specMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // 5. Summary stats
    const summary = {
      totalAppointments: appointments.length,
      totalDoctors: doctors.length,
      verifiedDoctors: doctors.filter(d => d.isVerified).length,
      totalPatients: patients.length,
      totalUsers: users.length,
      completedAppointments: appointments.filter(a => a.status?.status === 'Completed').length,
      cancelledAppointments: appointments.filter(a => a.status?.status === 'CANCELLED').length,
      cancellationRate: appointments.length
        ? Math.round((appointments.filter(a => a.status?.status === 'CANCELLED').length / appointments.length) * 100)
        : 0
    };

    return { summary, appointmentsPerMonth, statusBreakdown, topDoctors, topSpecializations };
  }
}
