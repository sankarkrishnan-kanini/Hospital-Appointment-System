import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';

@Injectable()
export class DoctorUnavailabilityService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doctorUnavailability.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.doctorUnavailability.findUnique({ where: { id } });
  }

  async create(data: CreateDoctorUnavailabilityDto) {
    return await this.prisma.doctorUnavailability.create({ data });
  }

  async update(id: number, data: UpdateDoctorUnavailabilityDto) {
    return await this.prisma.doctorUnavailability.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.doctorUnavailability.delete({ where: { id } });
  }
}
