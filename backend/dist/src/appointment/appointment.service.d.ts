import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
export declare class AppointmentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        userAccountId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        userAccountId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        userAccountId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        userAccountId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        officeId: number;
        userAccountId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
