import { Module } from '@nestjs/common';
import { HospitalAffiliationController } from './hospital-affiliation.controller';
import { HospitalAffiliationService } from './hospital-affiliation.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HospitalAffiliationController],
  providers: [HospitalAffiliationService, PrismaService]
})
export class HospitalAffiliationModule {}
