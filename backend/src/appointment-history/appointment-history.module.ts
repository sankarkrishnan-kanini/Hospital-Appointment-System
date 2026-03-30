import { Module } from '@nestjs/common';
import { AppointmentHistoryController } from './appointment-history.controller';
import { AppointmentHistoryService } from './appointment-history.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AppointmentHistoryController],
  providers: [AppointmentHistoryService, PrismaService]
})
export class AppointmentHistoryModule {}
