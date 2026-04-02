import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification-module/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
