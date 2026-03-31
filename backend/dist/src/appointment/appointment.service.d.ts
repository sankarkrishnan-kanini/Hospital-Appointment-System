import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
export declare class AppointmentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
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
    findOne(id: number): Promise<{
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
    } | null>;
    create(data: CreateAppointmentDto): Promise<{
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
    }>;
    update(id: number, data: UpdateAppointmentDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
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
    }>;
}
