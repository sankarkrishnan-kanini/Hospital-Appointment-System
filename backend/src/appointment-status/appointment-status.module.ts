import { Module } from '@nestjs/common';
import { AppointmentStatusController } from './appointment-status.controller';
import { AppointmentStatusService } from './appointment-status.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AppointmentStatusController],
  providers: [AppointmentStatusService, PrismaService]
})
export class AppointmentStatusModule {}
