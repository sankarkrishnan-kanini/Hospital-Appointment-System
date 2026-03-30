import { Module } from '@nestjs/common';
import { OfficedoctoravailabilityService } from './officedoctoravailability.service';
import { OfficedoctoravailabilityController } from './officedoctoravailability.controller';

@Module({
  providers: [OfficedoctoravailabilityService],
  controllers: [OfficedoctoravailabilityController]
})
export class OfficedoctoravailabilityModule {}
