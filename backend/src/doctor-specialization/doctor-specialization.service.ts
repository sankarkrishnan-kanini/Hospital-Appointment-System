import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';

@Injectable()
export class DoctorSpecializationService {

  findAll() {
    return prisma.doctorSpecialization.findMany();
  }

  findOne(id: number) {
    return prisma.doctorSpecialization.findUnique({ where: { id } });
  }

  create(data: CreateDoctorSpecializationDto) {
    return prisma.doctorSpecialization.create({ data });
  }

  update(id: number, data: Partial<CreateDoctorSpecializationDto>) {
    return prisma.doctorSpecialization.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.doctorSpecialization.delete({ where: { id } });
  }
}
