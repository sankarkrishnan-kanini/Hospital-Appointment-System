import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';

@Injectable()
export class InNetworkInsuranceService {

    constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.inNetworkInsurance.findMany();
  }

  findOne(id: number) {
    return this.prisma.inNetworkInsurance.findUnique({ where: { id } });
  }

  create(data: CreateInNetworkInsuranceDto) {
    return this.prisma.inNetworkInsurance.create({ data });
  }

  update(id: number, data: Partial<CreateInNetworkInsuranceDto>) {
    return this.prisma.inNetworkInsurance.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.inNetworkInsurance.delete({ where: { id } });
  }
}
