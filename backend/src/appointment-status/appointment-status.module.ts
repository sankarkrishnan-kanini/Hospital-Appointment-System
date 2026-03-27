import { Module } from '@nestjs/common';
import { AppointmentStatusController } from './appointment-status.controller';
import { AppointmentStatusService } from './appointment-status.service';

@Module({
  controllers: [AppointmentStatusController],
  providers: [AppointmentStatusService]
})
export class AppointmentStatusModule {}
