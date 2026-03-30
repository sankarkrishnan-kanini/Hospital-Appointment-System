import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';

@Injectable()
export class ClientAccountService {

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.clientAccount.findMany();
  }

  findOne(id: number) {
    return this.prisma.clientAccount.findUnique({ where: { id } });
  }

  create(data: CreateClientAccountDto) {
    return this.prisma.clientAccount.create({ data });
  }

  update(id: number, data: UpdateClientAccountDto) {
    return this.prisma.clientAccount.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.clientAccount.delete({ where: { id } });
  }
}
