import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
import { BookAppointmentDto } from './DTOS/bookAppointmentDTO';
import { CancelAppointmentDto } from './DTOS/cancelAppointmentDTO';
import { RescheduleAppointmentDto } from './DTOS/rescheduleAppointmentDTO';
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
    bookAppointment(dto: BookAppointmentDto): Promise<{
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
    }>;
    cancelAppointment(id: number, dto: CancelAppointmentDto): Promise<{
        status: {
            id: number;
            status: string;
        };
        office: {
            id: number;
            doctorId: number;
            city: string;
            country: string;
            hospitalAffiliationId: number | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string;
            state: string;
            zip: string;
        };
        timeSlot: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            officeId: number;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        };
    } & {
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
    }>;
    rescheduleAppointment(id: number, dto: RescheduleAppointmentDto): Promise<{
        status: {
            id: number;
            status: string;
        };
        office: {
            id: number;
            doctorId: number;
            city: string;
            country: string;
            hospitalAffiliationId: number | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string;
            state: string;
            zip: string;
        };
        timeSlot: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            officeId: number;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        };
    } & {
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
    }>;
    getClientAppointments(clientId: number): Promise<({
        status: {
            id: number;
            status: string;
        };
        office: {
            doctor: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                firstName: string;
                lastName: string;
                professionalStatement: string | null;
                practicingFrom: Date | null;
                isVerified: boolean;
            };
        } & {
            id: number;
            doctorId: number;
            city: string;
            country: string;
            hospitalAffiliationId: number | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string;
            state: string;
            zip: string;
        };
        timeSlot: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            officeId: number;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        };
    } & {
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
    })[]>;
    getDoctorAppointments(doctorId: number): Promise<({
        status: {
            id: number;
            status: string;
        };
        office: {
            id: number;
            doctorId: number;
            city: string;
            country: string;
            hospitalAffiliationId: number | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string;
            state: string;
            zip: string;
        };
        timeSlot: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            officeId: number;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        };
        client: {
            id: number;
            email: string;
            userId: number;
            firstName: string;
            lastName: string;
            contactNumber: string;
        };
    } & {
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
    })[]>;
    getAppointmentDetails(id: number): Promise<{
        status: {
            id: number;
            status: string;
        };
        office: {
            doctor: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                firstName: string;
                lastName: string;
                professionalStatement: string | null;
                practicingFrom: Date | null;
                isVerified: boolean;
            };
        } & {
            id: number;
            doctorId: number;
            city: string;
            country: string;
            hospitalAffiliationId: number | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string;
            state: string;
            zip: string;
        };
        timeSlot: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            officeId: number;
            startTime: Date;
            endTime: Date;
            isBooked: boolean;
        };
        client: {
            id: number;
            email: string;
            userId: number;
            firstName: string;
            lastName: string;
            contactNumber: string;
        };
    } & {
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
    }>;
    getAppointmentHistory(id: number): Promise<{
        id: number;
        appointmentId: number;
        oldTimeSlotId: number;
        newTimeSlotId: number;
        changedAt: Date;
    }[]>;
}
