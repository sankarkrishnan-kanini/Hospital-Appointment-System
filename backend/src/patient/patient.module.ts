import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AppointmentHistoryModule } from '../appointment-history/appointment-history.module';

@Module({
  imports: [PrismaModule, AppointmentHistoryModule],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
