import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';
import { UpdateHospitalAffiliationDto } from './DTOS/updateHospitalAffiliationDTO';

@Injectable()
export class HospitalAffiliationService {

  constructor(private readonly prisma: PrismaService) {}

  // GET /hospital-affiliation
  async findAll() {
    return await this.prisma.hospitalAffiliation.findMany({
      include: { doctor: true, offices: true }
    });
  }

  // GET /hospital-affiliation/:id
  async findOne(id: number) {
    const record = await this.prisma.hospitalAffiliation.findUnique({
      where: { id },
      include: { doctor: true, offices: true }
    });
    if (!record) throw new NotFoundException(`HospitalAffiliation #${id} not found`);
    return record;
  }

  // POST /hospital-affiliation
  async create(data: CreateHospitalAffiliationDto) {
    return await this.prisma.hospitalAffiliation.create({ data });
  }

  // PATCH /hospital-affiliation/:id
  async update(id: number, data: UpdateHospitalAffiliationDto) {
    return await this.prisma.hospitalAffiliation.update({ where: { id }, data });
  }

  // DELETE /hospital-affiliation/:id
  async remove(id: number) {
    return await this.prisma.hospitalAffiliation.delete({ where: { id } });
  }

  // GET /hospital-affiliation/doctor/:doctorId
  async findByDoctor(doctorId: number) {
    const records = await this.prisma.hospitalAffiliation.findMany({
      where: { doctorId },
      include: { offices: true },
      orderBy: { startDate: 'desc' }
    });
    if (!records.length) throw new NotFoundException(`No hospital affiliations found for doctor #${doctorId}`);
    return records;
  }

  // GET /hospital-affiliation/doctor/:doctorId/active
  async findActiveByDoctor(doctorId: number) {
    const records = await this.prisma.hospitalAffiliation.findMany({
      where: {
        doctorId,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      include: { offices: true },
      orderBy: { startDate: 'desc' }
    });
    if (!records.length) throw new NotFoundException(`No active affiliations found for doctor #${doctorId}`);
    return records;
  }

  // GET /hospital-affiliation/search?city=city&country=country
  async search(city?: string, country?: string) {
    const records = await this.prisma.hospitalAffiliation.findMany({
      where: {
        ...(city && { city: { contains: city } }),
        ...(country && { country: { contains: country } })
      },
      include: { doctor: true, offices: true },
      orderBy: { hospitalName: 'asc' }
    });
    if (!records.length) throw new NotFoundException(`No affiliations found for the given search criteria`);
    return records;
  }
}
