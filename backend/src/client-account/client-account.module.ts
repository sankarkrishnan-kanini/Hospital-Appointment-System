import { Module } from '@nestjs/common';
import { ClientAccountController } from './client-account.controller';
import { ClientAccountService } from './client-account.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ClientAccountController],
  providers: [ClientAccountService, PrismaService]
})
export class ClientAccountModule {}
