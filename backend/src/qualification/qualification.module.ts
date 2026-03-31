import { Module } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { QualificationController } from './qualification.controller';
import {PrismaModule} from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [QualificationService],
  controllers: [QualificationController]
})
export class QualificationModule {}
