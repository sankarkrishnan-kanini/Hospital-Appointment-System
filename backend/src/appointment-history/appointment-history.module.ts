import { Module } from '@nestjs/common';
import { AppointmentHistoryController } from './appointment-history.controller';
import { AppointmentHistoryService } from './appointment-history.service';

@Module({
  controllers: [AppointmentHistoryController],
  providers: [AppointmentHistoryService]
})
export class AppointmentHistoryModule {}
