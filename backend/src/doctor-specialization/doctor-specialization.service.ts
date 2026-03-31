import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';
import { UpdateDoctorSpecializationDto } from './DTOS/updateDoctorSpecializationDTO';

@Injectable()
export class DoctorSpecializationService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doctorSpecialization.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.doctorSpecialization.findUnique({ where: { id } });
  }

  async create(data: CreateDoctorSpecializationDto) {
    return await this.prisma.doctorSpecialization.create({ data });
  }

  async update(id: number, data: UpdateDoctorSpecializationDto) {
    return await this.prisma.doctorSpecialization.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.doctorSpecialization.delete({ where: { id } });
  }
}
