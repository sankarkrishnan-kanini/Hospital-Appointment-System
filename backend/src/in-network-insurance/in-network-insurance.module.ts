import { Module } from '@nestjs/common';
import { InNetworkInsuranceController } from './in-network-insurance.controller';
import { InNetworkInsuranceService } from './in-network-insurance.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InNetworkInsuranceController],
  providers: [InNetworkInsuranceService]
})
export class InNetworkInsuranceModule {}
