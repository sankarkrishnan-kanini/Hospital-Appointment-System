import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';

@Injectable()
export class InNetworkInsuranceService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.inNetworkInsurance.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.inNetworkInsurance.findUnique({ where: { id } });
  }

  async create(data: CreateInNetworkInsuranceDto) {
    return await this.prisma.inNetworkInsurance.create({ data });
  }

  async update(id: number, data: UpdateInNetworkInsuranceDto) {
    return await this.prisma.inNetworkInsurance.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.inNetworkInsurance.delete({ where: { id } });
  }
}
