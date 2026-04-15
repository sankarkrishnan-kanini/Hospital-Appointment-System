import { Module } from '@nestjs/common';
import { TimeslotCleanupService } from './timeslot-cleanup.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TimeslotCleanupService],
})
export class TimeslotCleanupModule {}
