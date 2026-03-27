import { Module } from '@nestjs/common';
import { HospitalAffiliationController } from './hospital-affiliation.controller';
import { HospitalAffiliationService } from './hospital-affiliation.service';

@Module({
  controllers: [HospitalAffiliationController],
  providers: [HospitalAffiliationService]
})
export class HospitalAffiliationModule {}
