import { Module } from '@nestjs/common';
import { OfficedoctoravailabilityService } from './officedoctoravailability.service';
import { OfficedoctoravailabilityController } from './officedoctoravailability.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OfficedoctoravailabilityService],
  controllers: [OfficedoctoravailabilityController]
})
export class OfficedoctoravailabilityModule {}
