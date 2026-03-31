import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';

@Injectable()
export class DoctorUnavailabilityService {

  constructor(private readonly prisma: PrismaService) {}

  // GET /doctor-unavailability
  async findAll() {
    return await this.prisma.doctorUnavailability.findMany({
      include: { doctor: true }
    });
  }

  // GET /doctor-unavailability/:id
  async findOne(id: number) {
    const record = await this.prisma.doctorUnavailability.findUnique({
      where: { id },
      include: { doctor: true }
    });
    if (!record) throw new NotFoundException(`DoctorUnavailability #${id} not found`);
    return record;
  }

  // POST /doctor-unavailability
  async create(data: CreateDoctorUnavailabilityDto) {
    return await this.prisma.doctorUnavailability.create({ data });
  }

  // PATCH /doctor-unavailability/:id
  async update(id: number, data: UpdateDoctorUnavailabilityDto) {
    return await this.prisma.doctorUnavailability.update({ where: { id }, data });
  }

  // DELETE /doctor-unavailability/:id
  async remove(id: number) {
    return await this.prisma.doctorUnavailability.delete({ where: { id } });
  }

  // GET /doctor-unavailability/doctor/:doctorId
  async findByDoctor(doctorId: number) {
    const records = await this.prisma.doctorUnavailability.findMany({
      where: { doctorId },
      orderBy: { date: 'asc' }
    });
    if (!records.length) throw new NotFoundException(`No unavailability records found for doctor #${doctorId}`);
    return records;
  }

  // GET /doctor-unavailability/doctor/:doctorId/upcoming
  async findUpcoming(doctorId: number) {
    const records = await this.prisma.doctorUnavailability.findMany({
      where: {
        doctorId,
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' }
    });
    if (!records.length) throw new NotFoundException(`No upcoming unavailability found for doctor #${doctorId}`);
    return records;
  }

  // GET /doctor-unavailability/doctor/:doctorId/check?date=YYYY-MM-DD
  async checkUnavailability(doctorId: number, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const record = await this.prisma.doctorUnavailability.findFirst({
      where: {
        doctorId,
        date: { gte: start, lte: end }
      }
    });
    return {
      doctorId,
      date,
      isUnavailable: !!record,
      reason: record?.reason ?? null
    };
  }

  // DELETE /doctor-unavailability/doctor/:doctorId/clear-past
  async clearPast(doctorId: number) {
    const result = await this.prisma.doctorUnavailability.deleteMany({
      where: {
        doctorId,
        date: { lt: new Date() }
      }
    });
    return { deleted: result.count, message: `Cleared ${result.count} past unavailability records for doctor #${doctorId}` };
  }
}
