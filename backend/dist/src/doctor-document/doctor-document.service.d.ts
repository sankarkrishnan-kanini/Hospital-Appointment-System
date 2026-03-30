import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';
import { UpdateDoctorDocumentDto } from './DTOS/updateDoctorDocumentDTO';
export declare class DoctorDocumentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        doctorId: number;
        documentType: string;
        fileUrl: import("@prisma/client/runtime/client").Bytes;
        uploadedAt: Date;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__DoctorDocumentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        doctorId: number;
        documentType: string;
        fileUrl: import("@prisma/client/runtime/client").Bytes;
        uploadedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateDoctorDocumentDto): import(".prisma/client").Prisma.Prisma__DoctorDocumentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        doctorId: number;
        documentType: string;
        fileUrl: import("@prisma/client/runtime/client").Bytes;
        uploadedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateDoctorDocumentDto): import(".prisma/client").Prisma.Prisma__DoctorDocumentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        doctorId: number;
        documentType: string;
        fileUrl: import("@prisma/client/runtime/client").Bytes;
        uploadedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__DoctorDocumentClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        doctorId: number;
        documentType: string;
        fileUrl: import("@prisma/client/runtime/client").Bytes;
        uploadedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
