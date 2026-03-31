import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeSlotDto } from './DTOS/createTimeSlotDTO';
import { UpdateTimeSlotDto } from './DTOS/updateTimeSlotDTO';

@Injectable()
export class TimeSlotService {

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.timeSlot.findMany();
  }

  findOne(id: number) {
    return this.prisma.timeSlot.findUnique({ where: { id } });
  }

  create(data: CreateTimeSlotDto) {
    return this.prisma.timeSlot.create({ data });
  }

  update(id: number, data: UpdateTimeSlotDto) {
    return this.prisma.timeSlot.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.timeSlot.delete({ where: { id } });
  }
}
