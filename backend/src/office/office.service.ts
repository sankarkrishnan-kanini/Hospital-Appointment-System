import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';

@Injectable()
export class OfficeService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.office.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.office.findUnique({ where: { id } });
  }

  async create(data: CreateOfficeDto) {
    return await this.prisma.office.create({ data });
  }

  async update(id: number, data: UpdateOfficeDto) {
    return await this.prisma.office.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.office.delete({ where: { id } });
  }
}
