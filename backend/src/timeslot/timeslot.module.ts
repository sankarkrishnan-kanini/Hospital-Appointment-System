import { Module } from '@nestjs/common';
import { TimeslotService } from './timeslot.service';
import { TimeslotController } from './timeslot.controller';
import {PrismaModule} from '../prisma/prisma.module';
@Module({
  imports:[PrismaModule],
  providers: [TimeslotService],
  controllers: [TimeslotController]
})
export class TimeslotModule {}
