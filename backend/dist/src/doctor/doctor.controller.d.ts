import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './DTOS/createDoctorDTO';
import { UpdateDoctorDto } from './DTOS/updateDoctorDTO';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        firstName: string;
        lastName: string;
        professionalStatement: string | null;
        practicingFrom: Date | null;
        isVerified: boolean;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__DoctorClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        firstName: string;
        lastName: string;
        professionalStatement: string | null;
        practicingFrom: Date | null;
        isVerified: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateDoctorDto): import(".prisma/client").Prisma.Prisma__DoctorClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        firstName: string;
        lastName: string;
        professionalStatement: string | null;
        practicingFrom: Date | null;
        isVerified: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateDoctorDto): import(".prisma/client").Prisma.Prisma__DoctorClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        firstName: string;
        lastName: string;
        professionalStatement: string | null;
        practicingFrom: Date | null;
        isVerified: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__DoctorClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        firstName: string;
        lastName: string;
        professionalStatement: string | null;
        practicingFrom: Date | null;
        isVerified: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
