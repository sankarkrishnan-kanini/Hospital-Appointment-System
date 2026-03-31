import { Module } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { SpecializationController } from './specialization.controller';
import {PrismaModule} from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [SpecializationService],
  controllers: [SpecializationController]
})
export class SpecializationModule {}
