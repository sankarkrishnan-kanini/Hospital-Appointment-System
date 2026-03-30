import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';

@Injectable()
export class OfficeService {

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.office.findMany();
  }

  findOne(id: number) {
    return this.prisma.office.findUnique({ where: { id } });
  }

  create(data: CreateOfficeDto) {
    return this.prisma.office.create({ data });
  }

  update(id: number, data: UpdateOfficeDto) {
    return this.prisma.office.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.office.delete({ where: { id } });
  }
}
