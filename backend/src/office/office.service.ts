import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';

@Injectable()
export class OfficeService {

  findAll() {
    return prisma.office.findMany();
  }

  findOne(id: number) {
    return prisma.office.findUnique({ where: { id } });
  }

  create(data: CreateOfficeDto) {
    return prisma.office.create({ data });
  }

  update(id: number, data: Partial<CreateOfficeDto>) {
    return prisma.office.update({ where: { id }, data });
  }

  remove(id: number) {
    return prisma.office.delete({ where: { id } });
  }
}
