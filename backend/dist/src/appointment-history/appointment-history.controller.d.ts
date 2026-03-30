import { AppointmentHistoryService } from './appointment-history.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';
export declare class AppointmentHistoryController {
    private readonly appointmentHistoryService;
    constructor(appointmentHistoryService: AppointmentHistoryService);
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
    create(dto: CreateAppointmentHistoryDto): import(".prisma/client").Prisma.Prisma__AppointmentHistoryClient<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateAppointmentHistoryDto): import(".prisma/client").Prisma.Prisma__AppointmentHistoryClient<{
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
