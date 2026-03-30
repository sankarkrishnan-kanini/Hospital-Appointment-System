import { Module } from '@nestjs/common';
import { DoctorSpecializationController } from './doctor-specialization.controller';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DoctorSpecializationController],
  providers: [DoctorSpecializationService, PrismaService]
})
export class DoctorSpecializationModule {}
