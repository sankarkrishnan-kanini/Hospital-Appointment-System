import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';

@Injectable()
export class ClientAccountService {

  findAll() {
    return prisma.clientAccount.findMany();
  }

  findOne(id: number) {
    return prisma.clientAccount.findUnique({
      where: { id }
    });
  }

  create(data: CreateClientAccountDto) {
    return prisma.clientAccount.create({ data });
  }

  update(id: number, data: UpdateClientAccountDto) {
    return prisma.clientAccount.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return prisma.clientAccount.delete({
      where: { id }
    });
  }
}
