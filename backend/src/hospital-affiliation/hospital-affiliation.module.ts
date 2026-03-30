import { Module } from '@nestjs/common';
import { HospitalAffiliationController } from './hospital-affiliation.controller';
import { HospitalAffiliationService } from './hospital-affiliation.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [HospitalAffiliationController],
  providers: [HospitalAffiliationService]
})
export class HospitalAffiliationModule {}
