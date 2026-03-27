import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { AppointmentHistoryModule } from './appointment-history/appointment-history.module';
import { ClientAccountModule } from './client-account/client-account.module';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorDocumentModule } from './doctor-document/doctor-document.module';
import { AppointmentStatusModule } from './appointment-status/appointment-status.module';

@Module({
  imports: [AppointmentModule, AppointmentHistoryModule, ClientAccountModule, DoctorModule, DoctorDocumentModule, AppointmentStatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
