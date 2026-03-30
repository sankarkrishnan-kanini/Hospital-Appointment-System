import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        id: number;
        actualEndTime: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        id: number;
        actualEndTime: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(createAppointmentDto: CreateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        id: number;
        actualEndTime: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateAppointmentDto): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        id: number;
        actualEndTime: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        id: number;
        actualEndTime: Date | null;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
