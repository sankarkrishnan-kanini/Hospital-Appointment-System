import { Module } from '@nestjs/common';
import { InNetworkInsuranceController } from './in-network-insurance.controller';
import { InNetworkInsuranceService } from './in-network-insurance.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InNetworkInsuranceController],
  providers: [InNetworkInsuranceService, PrismaService]
})
export class InNetworkInsuranceModule {}
