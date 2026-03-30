import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';

@Injectable()
export class InNetworkInsuranceService {

  findAll() {
    return prisma.inNetworkInsurance.findMany();
  }

  findOne(id: number) {
    return prisma.inNetworkInsurance.findUnique({ where: { id } });
  }

  create(data: CreateInNetworkInsuranceDto) {
    return prisma.inNetworkInsurance.create({ data });
  }

  update(id: number, data: UpdateInNetworkInsuranceDto) {
    return prisma.inNetworkInsurance.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.inNetworkInsurance.delete({ where: { id } });
  }
}
