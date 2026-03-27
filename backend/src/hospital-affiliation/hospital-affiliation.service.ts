import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';

@Injectable()
export class HospitalAffiliationService {

  findAll() {
    return prisma.hospitalAffiliation.findMany();
  }

  findOne(id: number) {
    return prisma.hospitalAffiliation.findUnique({ where: { id } });
  }

  create(data: CreateHospitalAffiliationDto) {
    return prisma.hospitalAffiliation.create({ data });
  }

  update(id: number, data: Partial<CreateHospitalAffiliationDto>) {
    return prisma.hospitalAffiliation.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.hospitalAffiliation.delete({ where: { id } });
  }
}
