import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';

@Injectable()
export class OfficeService {

  constructor(private readonly prisma: PrismaService) {}

  // GET /office
  async findAll() {
    return await this.prisma.office.findMany({
      include: {
        doctor: true,
        hospitalAffiliation: true,
        insurances: true,
        availability: true
      }
    });
  }

  // GET /office/:id
  async findOne(id: number) {
    const record = await this.prisma.office.findUnique({
      where: { id },
      include: {
        doctor: true,
        hospitalAffiliation: true,
        insurances: true,
        availability: true,
        timeSlots: true
      }
    });
    if (!record) throw new NotFoundException(`Office #${id} not found`);
    return record;
  }

  // POST /office
  async create(data: CreateOfficeDto) {
    return await this.prisma.office.create({
      data: {
        doctorId: 0,
        hospitalAffiliationId: data.hospitalAffiliationId ?? null,
        timeSlotPerClientInMin: data.timeSlotPerClientInMin,
        firstConsultationFee: data.firstConsultationFee,
        followupConsultationFee: data.followupConsultationFee,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip
      }
    });
  }

  // PATCH /office/:id
  async update(id: number, data: UpdateOfficeDto) {
    return await this.prisma.office.update({ where: { id }, data });
  }

  // DELETE /office/:id
  async remove(id: number) {
    return await this.prisma.office.delete({ where: { id } });
  }

  // GET /office/doctor/:doctorId
  async findByDoctor(doctorId: number) {
    const records = await this.prisma.office.findMany({
      where: { doctorId },
      include: {
        hospitalAffiliation: true,
        insurances: true,
        availability: true
      }
    });
    if (!records.length) throw new NotFoundException(`No offices found for doctor #${doctorId}`);
    return records;
  }

  // GET /office/search?city=&state=&country=&maxFee=
  async search(city?: string, state?: string, country?: string, maxFee?: number) {
    const records = await this.prisma.office.findMany({
      where: {
        ...(city && { city: { contains: city } }),
        ...(state && { state: { contains: state } }),
        ...(country && { country: { contains: country } }),
        ...(maxFee && { firstConsultationFee: { lte: maxFee } })
      },
      include: {
        doctor: true,
        insurances: true,
        availability: true
      },
      orderBy: { firstConsultationFee: 'asc' }
    });
    if (!records.length) throw new NotFoundException(`No offices found for the given search criteria`);
    return records;
  }

  // GET /office/:id/availability
  async getAvailability(id: number) {
    const record = await this.prisma.office.findUnique({
      where: { id },
      include: {
        availability: {
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    });
    if (!record) throw new NotFoundException(`Office #${id} not found`);
    if (!record.availability.length) throw new NotFoundException(`No availability schedule found for office #${id}`);
    return record.availability;
  }

  // GET /office/:id/timeslots/available?date=YYYY-MM-DD
  async getAvailableTimeSlots(id: number, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const slots = await this.prisma.timeSlot.findMany({
      where: {
        officeId: id,
        isBooked: false,
        startTime: { gte: start, lte: end }
      },
      orderBy: { startTime: 'asc' }
    });
    if (!slots.length) throw new NotFoundException(`No available time slots for office #${id} on ${date}`);
    return slots;
  }

  // GET /office/:id/insurances
  async getInsurances(id: number) {
    const record = await this.prisma.office.findUnique({
      where: { id },
      include: { insurances: true }
    });
    if (!record) throw new NotFoundException(`Office #${id} not found`);
    if (!record.insurances.length) throw new NotFoundException(`No insurances found for office #${id}`);
    return record.insurances;
  }
}
