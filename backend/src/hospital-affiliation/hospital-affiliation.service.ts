import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';

@Injectable()
export class HospitalAffiliationService {
 
    constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.hospitalAffiliation.findMany();
  }

  findOne(id: number) {
    return this.prisma.hospitalAffiliation.findUnique({ where: { id } });
  }

  create(data: CreateHospitalAffiliationDto) {
    return this.prisma.hospitalAffiliation.create({ data });
  }

  update(id: number, data: Partial<CreateHospitalAffiliationDto>) {
    return this.prisma.hospitalAffiliation.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.hospitalAffiliation.delete({ where: { id } });
  }
}
