import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';

@Injectable()
export class ClientAccountService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.clientAccount.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.clientAccount.findUnique({ where: { id } });
  }

  async create(data: CreateClientAccountDto) {
    return await this.prisma.clientAccount.create({ data });
  }

  async update(id: number, data: UpdateClientAccountDto) {
    return await this.prisma.clientAccount.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.clientAccount.delete({ where: { id } });
  }
}
