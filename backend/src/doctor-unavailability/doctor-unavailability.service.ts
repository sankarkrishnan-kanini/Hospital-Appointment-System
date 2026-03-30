import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';

@Injectable()
export class DoctorUnavailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.doctorUnavailability.findMany();
  }

  findOne(id: number) {
    return this.prisma.doctorUnavailability.findUnique({ where: { id } });
  }

  create(data: CreateDoctorUnavailabilityDto) {
    return this.prisma.doctorUnavailability.create({ data });
  }

  update(id: number, data: Partial<CreateDoctorUnavailabilityDto>) {
    return this.prisma.doctorUnavailability.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.doctorUnavailability.delete({ where: { id } });
  }
}
