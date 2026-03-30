import { Module } from '@nestjs/common';
import { DoctorUnavailabilityController } from './doctor-unavailability.controller';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [DoctorUnavailabilityController],
  providers: [DoctorUnavailabilityService]
})
export class DoctorUnavailabilityModule {}
