import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDoctorDto } from '../doctor/DTOS/updateDoctorDTO';
import { SetupProfileDto } from './DTOS/setupProfileDto';
import { CreateOfficeDto } from '../office/DTOS/createOfficeDTO';

@Injectable()
export class DoctorRoleService {

  constructor(private readonly prisma: PrismaService) {}

  // ─── SETUP PROFILE (ALL IN ONE) ──────────────────────────────────────────────

  async setupProfile(userId: number, dto: SetupProfileDto, files: Express.Multer.File[]) {
    // Check user exists and has doctor role
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User not found`);
    if (user.role !== 'doctor') throw new BadRequestException(`User does not have doctor role`);

    // Get or create doctor profile
    let doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      doctor = await this.prisma.doctor.create({
        data: {
          userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isVerified: false,
          verificationRequested: false
        }
      });
    }

    if (doctor.isVerified)
      throw new BadRequestException(`Cannot update profile of a verified doctor`);

    if (files.length === 0)
      throw new BadRequestException(`Please upload at least one document`);

    if (files.length !== dto.documentTypes.length)
      throw new BadRequestException(`Number of files must match number of document types`);

    // Validate specializations exist
    for (const specId of dto.specializations) {
      const spec = await this.prisma.specialization.findUnique({ where: { id: specId } });
      if (!spec) throw new NotFoundException(`Specialization with id ${specId} not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      try {

      // 1. Update basic profile
      await tx.doctor.update({
        where: { userId },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          professionalStatement: dto.professionalStatement,
          practicingFrom: dto.practicingFrom ? new Date(dto.practicingFrom) : undefined
        }
      });

      // 2. Delete existing specializations and re-add
      await tx.doctorSpecialization.deleteMany({ where: { doctorId: doctor.id } });
      await tx.doctorSpecialization.createMany({
        data: dto.specializations.map(specializationId => ({
          doctorId: doctor.id,
          specializationId
        }))
      });

      // 3. Delete existing qualifications and re-add
      await tx.qualification.deleteMany({ where: { doctorId: doctor.id } });
      await tx.qualification.createMany({
        data: dto.qualifications.map((q: any) => ({
          doctorId: doctor.id,
          qualificationName: q.qualificationName,
          instituteName: q.instituteName,
          procurementYear: q.procurementYear ? new Date(q.procurementYear) : undefined
        }))
      });

      // 4. Delete existing hospital affiliations and re-add
      await tx.hospitalAffiliation.deleteMany({ where: { doctorId: doctor.id } });
      if (dto.hospitalAffiliations && dto.hospitalAffiliations.length > 0) {
        await tx.hospitalAffiliation.createMany({
          data: dto.hospitalAffiliations.map((h: any) => ({
            doctorId: doctor.id,
            hospitalName: h.hospitalName,
            city: h.city,
            country: h.country,
            startDate: h.startDate ? new Date(h.startDate) : undefined,
            endDate: h.endDate ? new Date(h.endDate) : undefined
          }))
        });
      }

      // 5. Delete existing documents and re-upload
      await tx.doctorDocument.deleteMany({ where: { doctorId: doctor.id } });
      await tx.doctorDocument.createMany({
        data: files.map((file, index) => ({
          doctorId: doctor.id,
          documentType: dto.documentTypes[index],
          fileUrl: Buffer.from(file.buffer) as unknown as Uint8Array<ArrayBuffer>
        }))
      });

      return { message: 'Profile setup successfully. You can now request verification.' };
      } catch (e) {
        throw e;
      }
    });
  }

  // ─── GET PROFILE ─────────────────────────────────────────────────────────────

  async getProfile(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        specializations: { include: { specialization: true } },
        offices: true,
        qualifications: true,
        hospitalAffiliations: true,
        documents: true
      }
    });
    if (!doctor) throw new NotFoundException(`Doctor profile not found for user ${userId}`);

    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      professionalStatement: doctor.professionalStatement,
      practicingFrom: doctor.practicingFrom,
      isVerified: doctor.isVerified,
      verificationRequested: doctor.verificationRequested,
      specializations: doctor.specializations.map(ds => ds.specialization.specializationName),
      offices: doctor.offices,
      qualifications: doctor.qualifications.map(q => ({
        name: q.qualificationName,
        institute: q.instituteName,
        year: q.procurementYear
      })),
      hospitalAffiliations: doctor.hospitalAffiliations.map(h => ({
        hospitalName: h.hospitalName,
        city: h.city,
        country: h.country,
        startDate: h.startDate,
        endDate: h.endDate
      })),
      documentCount: doctor.documents.length
    };
  }

  // ─── UPDATE BASIC INFO (AFTER VERIFICATION) ──────────────────────────────────

  async updateProfile(userId: number, dto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException(`Doctor profile not found for user ${userId}`);

    const { firstName, lastName, professionalStatement, practicingFrom } = dto;
    return this.prisma.doctor.update({
      where: { userId },
      data: { firstName, lastName, professionalStatement, practicingFrom }
    });
  }

  // ─── DOCUMENT DOWNLOAD ───────────────────────────────────────────────────────

  async downloadDocument(userId: number, documentId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException(`Doctor profile not found for user ${userId}`);

    const document = await this.prisma.doctorDocument.findUnique({ where: { id: documentId } });
    if (!document) throw new NotFoundException(`Document with id ${documentId} not found`);

    if (document.doctorId !== doctor.id)
      throw new BadRequestException(`Document does not belong to this doctor`);

    return document;
  }

  // ─── REQUEST VERIFICATION ────────────────────────────────────────────────────

  async requestVerification(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: { documents: true, specializations: true, qualifications: true }
    });
    if (!doctor) throw new NotFoundException(`Doctor profile not found for user ${userId}`);

    if (doctor.isVerified)
      throw new BadRequestException(`Doctor is already verified`);

    if (doctor.verificationRequested)
      throw new BadRequestException(`Verification already requested`);

    if (doctor.documents.length === 0)
      throw new BadRequestException(`Please upload documents before requesting verification`);

    if (doctor.specializations.length === 0)
      throw new BadRequestException(`Please add at least one specialization before requesting verification`);

    if (doctor.qualifications.length === 0)
      throw new BadRequestException(`Please add at least one qualification before requesting verification`);

    return this.prisma.doctor.update({
      where: { userId },
      data: { verificationRequested: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isVerified: true,
        verificationRequested: true
      }
    });
  }

  // ─── REQUEST SPECIALIZATION ─────────────────────────────────────────────────

  async requestSpecialization(userId: number, specializationId: number, file: Express.Multer.File) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException(`Doctor profile not found`);

    if (!doctor.isVerified)
      throw new BadRequestException(`Only verified doctors can request new specializations`);

    const specialization = await this.prisma.specialization.findUnique({ where: { id: specializationId } });
    if (!specialization) throw new NotFoundException(`Specialization not found`);

    const existing = await this.prisma.doctorSpecialization.findFirst({
      where: { doctorId: doctor.id, specializationId }
    });
    if (existing) throw new BadRequestException(`Doctor already has this specialization`);

    if (!file) throw new BadRequestException(`Proof document is required`);

    const doc = await this.prisma.doctorDocument.create({
      data: {
        doctorId: doctor.id,
        documentType: `SPECIALIZATION_REQUEST_${specializationId}`,
        fileUrl: Buffer.from(file.buffer) as unknown as Uint8Array<ArrayBuffer>
      }
    });

    return {
      id: doc.id,
      documentType: doc.documentType,
      uploadedAt: doc.uploadedAt,
      message: `Specialization request submitted. Admin will review and approve.`
    };
  }

  // ─── OFFICE MANAGEMENT ──────────────────────────────────────────────────────

  async createOffice(userId: number, dto: CreateOfficeDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException(`Doctor profile not found`);

    if (!doctor.isVerified)
      throw new BadRequestException(`Only verified doctors can create offices`);

    return this.prisma.office.create({
      data: {
        doctorId: doctor.id,
        hospitalAffiliationId: dto.hospitalAffiliationId ?? null,
        timeSlotPerClientInMin: dto.timeSlotPerClientInMin,
        firstConsultationFee: dto.firstConsultationFee,
        followupConsultationFee: dto.followupConsultationFee,
        streetAddress: dto.streetAddress,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        zip: dto.zip
      }
    });
  }

  async getOffices(userId: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException(`Doctor profile not found`);

    return this.prisma.office.findMany({
      where: { doctorId: doctor.id }
    });
  }
}
