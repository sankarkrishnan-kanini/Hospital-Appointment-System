import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';
export declare class DoctorUnavailabilityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        doctorId: number;
        date: Date;
        reason: string | null;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__DoctorUnavailabilityClient<{
        id: number;
        doctorId: number;
        date: Date;
        reason: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateDoctorUnavailabilityDto): import(".prisma/client").Prisma.Prisma__DoctorUnavailabilityClient<{
        id: number;
        doctorId: number;
        date: Date;
        reason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateDoctorUnavailabilityDto): import(".prisma/client").Prisma.Prisma__DoctorUnavailabilityClient<{
        id: number;
        doctorId: number;
        date: Date;
        reason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__DoctorUnavailabilityClient<{
        id: number;
        doctorId: number;
        date: Date;
        reason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
