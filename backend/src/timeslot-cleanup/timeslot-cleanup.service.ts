import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimeslotCleanupService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TimeslotCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}
  async onApplicationBootstrap() {
    await this.deleteExpiredTimeslots();
  }
  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredTimeslots() {
    const now = new Date();

    const { count } = await this.prisma.timeSlot.deleteMany({
      where: {
        endTime: { lt: now },
        isBooked: false,
      },
    });

    if (count > 0) this.logger.log(`Deleted ${count} expired unbooked timeslots`);
  }
}
