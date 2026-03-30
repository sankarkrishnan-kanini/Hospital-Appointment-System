import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';
import { UpdateHospitalAffiliationDto } from './DTOS/updateHospitalAffiliationDTO';

@Injectable()
export class HospitalAffiliationService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.hospitalAffiliation.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.hospitalAffiliation.findUnique({ where: { id } });
  }

  async create(data: CreateHospitalAffiliationDto) {
    return await this.prisma.hospitalAffiliation.create({ data });
  }

  async update(id: number, data: UpdateHospitalAffiliationDto) {
    return await this.prisma.hospitalAffiliation.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.hospitalAffiliation.delete({ where: { id } });
  }
}
