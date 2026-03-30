import { Module } from '@nestjs/common';
import { DoctorSpecializationController } from './doctor-specialization.controller';
import { DoctorSpecializationService } from './doctor-specialization.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorSpecializationController],
  providers: [DoctorSpecializationService]
})
export class DoctorSpecializationModule {}
