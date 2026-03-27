import { Module } from '@nestjs/common';
import { DoctorSpecializationController } from './doctor-specialization.controller';
import { DoctorSpecializationService } from './doctor-specialization.service';

@Module({
  controllers: [DoctorSpecializationController],
  providers: [DoctorSpecializationService]
})
export class DoctorSpecializationModule {}
