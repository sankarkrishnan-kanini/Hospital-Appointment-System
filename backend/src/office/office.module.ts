import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { OfficeService } from './office.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OfficeController],
  providers: [OfficeService, PrismaService]
})
export class OfficeModule {}
