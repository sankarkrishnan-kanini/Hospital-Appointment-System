import { Module } from '@nestjs/common';
import { InNetworkInsuranceController } from './in-network-insurance.controller';
import { InNetworkInsuranceService } from './in-network-insurance.service';

@Module({
  controllers: [InNetworkInsuranceController],
  providers: [InNetworkInsuranceService]
})
export class InNetworkInsuranceModule {}
