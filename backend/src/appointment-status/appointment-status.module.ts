import { Module } from '@nestjs/common';
import { AppointmentStatusController } from './appointment-status.controller';
import { AppointmentStatusService } from './appointment-status.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentStatusController],
  providers: [AppointmentStatusService]
})
export class AppointmentStatusModule {}
