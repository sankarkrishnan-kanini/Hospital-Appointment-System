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

    // Collect all time slot IDs referenced in appointment history
    const referenced = await this.prisma.appointmentHistory.findMany({
      select: { oldTimeSlotId: true, newTimeSlotId: true },
    });
    const referencedIds = [...new Set(referenced.flatMap(h => [h.oldTimeSlotId, h.newTimeSlotId]))];

    const { count } = await this.prisma.timeSlot.deleteMany({
      where: {
        endTime: { lt: now },
        isBooked: false,
        ...(referencedIds.length > 0 && { id: { notIn: referencedIds } }),
      },
    });

    if (count > 0) this.logger.log(`Deleted ${count} expired unbooked timeslots`);
  }
}
