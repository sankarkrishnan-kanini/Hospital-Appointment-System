import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './DTOS/createDoctorDTO';
import { UpdateDoctorDto } from './DTOS/updateDoctorDTO';

@Injectable()
export class DoctorService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doctor.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.doctor.findUnique({ where: { id } });
  }

  async create(data: CreateDoctorDto) {
    return await this.prisma.doctor.create({ data });
  }

  async update(id: number, data: UpdateDoctorDto) {
    return await this.prisma.doctor.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.doctor.delete({ where: { id } });
  }
}
