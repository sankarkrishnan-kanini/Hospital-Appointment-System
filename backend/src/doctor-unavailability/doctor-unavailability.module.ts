import { Module } from '@nestjs/common';
import { DoctorUnavailabilityController } from './doctor-unavailability.controller';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';

@Module({
  controllers: [DoctorUnavailabilityController],
  providers: [DoctorUnavailabilityService]
})
export class DoctorUnavailabilityModule {}
