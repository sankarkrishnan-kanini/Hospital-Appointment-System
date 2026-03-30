import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';
export declare class AppointmentHistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__AppointmentHistoryClient<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateAppointmentHistoryDto): import(".prisma/client").Prisma.Prisma__AppointmentHistoryClient<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateAppointmentHistoryDto): import(".prisma/client").Prisma.Prisma__AppointmentHistoryClient<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__AppointmentHistoryClient<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
