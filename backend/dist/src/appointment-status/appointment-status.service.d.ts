import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';
import { UpdateAppointmentStatusDto } from './DTOS/updateAppointmentStatusDTO';
export declare class AppointmentStatusService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateAppointmentStatusDto): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateAppointmentStatusDto): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__AppointmentStatusClient<{
        id: number;
        status: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
