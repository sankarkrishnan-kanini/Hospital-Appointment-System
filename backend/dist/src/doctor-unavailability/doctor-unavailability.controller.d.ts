import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';
export declare class DoctorUnavailabilityController {
    private readonly doctorUnavailabilityService;
    constructor(doctorUnavailabilityService: DoctorUnavailabilityService);
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
    create(dto: CreateDoctorUnavailabilityDto): import(".prisma/client").Prisma.Prisma__DoctorUnavailabilityClient<{
        id: number;
        doctorId: number;
        date: Date;
        reason: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateDoctorUnavailabilityDto): import(".prisma/client").Prisma.Prisma__DoctorUnavailabilityClient<{
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
