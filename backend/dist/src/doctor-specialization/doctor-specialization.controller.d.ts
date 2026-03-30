import { DoctorSpecializationService } from './doctor-specialization.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';
import { UpdateDoctorSpecializationDto } from './DTOS/updateDoctorSpecializationDTO';
export declare class DoctorSpecializationController {
    private readonly doctorSpecializationService;
    constructor(doctorSpecializationService: DoctorSpecializationService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        doctorId: number;
        specializationId: number;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__DoctorSpecializationClient<{
        id: number;
        doctorId: number;
        specializationId: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateDoctorSpecializationDto): import(".prisma/client").Prisma.Prisma__DoctorSpecializationClient<{
        id: number;
        doctorId: number;
        specializationId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateDoctorSpecializationDto): import(".prisma/client").Prisma.Prisma__DoctorSpecializationClient<{
        id: number;
        doctorId: number;
        specializationId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__DoctorSpecializationClient<{
        id: number;
        doctorId: number;
        specializationId: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
