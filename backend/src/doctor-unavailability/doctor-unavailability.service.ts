import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';

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

  update(id: number, data: UpdateDoctorUnavailabilityDto) {
    return prisma.doctorUnavailability.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.doctorUnavailability.delete({ where: { id } });
  }
}
