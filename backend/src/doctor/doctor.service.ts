import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateDoctorDto } from './DTOS/createDoctorDTO';
import { UpdateDoctorDto } from './DTOS/updateDoctorDTO';

@Injectable()
export class DoctorService {

  findAll() {
    return prisma.doctor.findMany();
  }

  findOne(id: number) {
    return prisma.doctor.findUnique({
      where: { id }
    });
  }

  create(data: CreateDoctorDto) {
    return prisma.doctor.create({ data });
  }

  update(id: number, data: UpdateDoctorDto) {
    return prisma.doctor.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return prisma.doctor.delete({
      where: { id }
    });
  }
}
