import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';
import { UpdateDoctorSpecializationDto } from './DTOS/updateDoctorSpecializationDTO';

@Injectable()
export class DoctorSpecializationService {

  constructor(private readonly prisma: PrismaService) {}

  // GET /doctor-specialization
  async findAll() {
    return await this.prisma.doctorSpecialization.findMany({
      include: { doctor: true, specialization: true }
    });
  }

  // GET /doctor-specialization/:id
  async findOne(id: number) {
    const record = await this.prisma.doctorSpecialization.findUnique({
      where: { id },
      include: { doctor: true, specialization: true }
    });
    if (!record) throw new NotFoundException(`DoctorSpecialization #${id} not found`);
    return record;
  }

  // POST /doctor-specialization
  async create(data: CreateDoctorSpecializationDto) {
    return await this.prisma.doctorSpecialization.create({ data });
  }

  // PATCH /doctor-specialization/:id
  async update(id: number, data: UpdateDoctorSpecializationDto) {
    return await this.prisma.doctorSpecialization.update({ where: { id }, data });
  }

  // DELETE /doctor-specialization/:id
  async remove(id: number) {
    return await this.prisma.doctorSpecialization.delete({ where: { id } });
  }

  // GET /doctor-specialization/doctor/:doctorId
  async findByDoctor(doctorId: number) {
    const records = await this.prisma.doctorSpecialization.findMany({
      where: { doctorId },
      include: { specialization: true }
    });
    if (!records.length) throw new NotFoundException(`No specializations found for doctor #${doctorId}`);
    return records;
  }

  // GET /doctor-specialization/specialization/:specializationId/doctors
  async findDoctorsBySpecialization(specializationId: number) {
    const records = await this.prisma.doctorSpecialization.findMany({
      where: { specializationId },
      include: {
        doctor: {
          include: { user: { select: { email: true } } }
        }
      }
    });
    if (!records.length) throw new NotFoundException(`No doctors found for specialization #${specializationId}`);
    return records;
  }

  // DELETE /doctor-specialization/doctor/:doctorId/specialization/:specializationId
  async removeByDoctorAndSpecialization(doctorId: number, specializationId: number) {
    const record = await this.prisma.doctorSpecialization.findFirst({
      where: { doctorId, specializationId }
    });
    if (!record) throw new NotFoundException(`No record found for doctor #${doctorId} and specialization #${specializationId}`);
    return await this.prisma.doctorSpecialization.delete({ where: { id: record.id } });
  }
}
