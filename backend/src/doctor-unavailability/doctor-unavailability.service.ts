import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';

@Injectable()
export class DoctorUnavailabilityService {

  findAll() {
    return prisma.doctorUnavailability.findMany();
  }

  findOne(id: number) {
    return prisma.doctorUnavailability.findUnique({ where: { id } });
  }

  create(data: CreateDoctorUnavailabilityDto) {
    return prisma.doctorUnavailability.create({ data });
  }

  update(id: number, data: Partial<CreateDoctorUnavailabilityDto>) {
    return prisma.doctorUnavailability.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.doctorUnavailability.delete({ where: { id } });
  }
}
