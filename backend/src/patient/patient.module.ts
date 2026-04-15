import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AppointmentHistoryModule } from '../appointment-history/appointment-history.module';
import { NotificationModule } from '../notification-module/notification.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, NotificationModule, AppointmentHistoryModule, MailModule],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
