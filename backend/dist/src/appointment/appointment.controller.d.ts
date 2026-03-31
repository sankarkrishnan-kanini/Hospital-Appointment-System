import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
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
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
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
