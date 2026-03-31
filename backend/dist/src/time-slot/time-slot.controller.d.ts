import { TimeSlotService } from './time-slot.service';
import { CreateTimeSlotDto } from './DTOS/createTimeSlotDTO';
import { UpdateTimeSlotDto } from './DTOS/updateTimeSlotDTO';
export declare class TimeSlotController {
    private readonly timeSlotService;
    constructor(timeSlotService: TimeSlotService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__TimeSlotClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateTimeSlotDto): import(".prisma/client").Prisma.Prisma__TimeSlotClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateTimeSlotDto): import(".prisma/client").Prisma.Prisma__TimeSlotClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__TimeSlotClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        startTime: Date;
        endTime: Date;
        isBooked: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
