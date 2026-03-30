import { Module } from '@nestjs/common';
import { OfficedoctoravailabilityService } from './officedoctoravailability.service';
import { OfficedoctoravailabilityController } from './officedoctoravailability.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OfficedoctoravailabilityController],
  providers: [OfficedoctoravailabilityService, PrismaService]
})
export class OfficedoctoravailabilityModule {}
