import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';

@Injectable()
export class DoctorSpecializationService {
   constructor(private readonly prisma:PrismaService){}
  findAll() {
    return this.prisma.doctorSpecialization.findMany();
  }

  findOne(id: number) {
    return this.prisma.doctorSpecialization.findUnique({ where: { id } });
  }

  create(data: CreateDoctorSpecializationDto) {
    return this.prisma.doctorSpecialization.create({ data });
  }

  update(id: number, data: Partial<CreateDoctorSpecializationDto>) {
    return this.prisma.doctorSpecialization.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.doctorSpecialization.delete({ where: { id } });
  }
}
