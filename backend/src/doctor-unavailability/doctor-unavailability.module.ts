import { Module } from '@nestjs/common';
import { DoctorUnavailabilityController } from './doctor-unavailability.controller';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DoctorUnavailabilityController],
  providers: [DoctorUnavailabilityService, PrismaService]
})
export class DoctorUnavailabilityModule {}
