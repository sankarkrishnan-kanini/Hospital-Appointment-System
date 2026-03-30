import { AppointmentStatusService } from './appointment-status.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';
import { UpdateAppointmentStatusDto } from './DTOS/updateAppointmentStatusDTO';
export declare class AppointmentStatusController {
    private readonly appointmentStatusService;
    constructor(appointmentStatusService: AppointmentStatusService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateAppointmentStatusDto): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateAppointmentStatusDto): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
