import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
export declare class AppointmentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: CreateAppointmentDto): Promise<{
        id: number;
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, data: UpdateAppointmentDto): Promise<{
        id: number;
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        userAccountId: number;
        officeId: number;
        timeSlotId: number;
        probableStartTime: Date;
        actualEndTime: Date | null;
        durationInMinutes: number;
        appointmentStatusId: number;
        appointmentTakenDate: Date;
        cancellationReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
