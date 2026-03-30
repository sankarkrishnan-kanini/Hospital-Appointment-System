import { Module } from '@nestjs/common';
import { ClientAccountController } from './client-account.controller';
import { ClientAccountService } from './client-account.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientAccountController],
  providers: [ClientAccountService]
})
export class ClientAccountModule {}
