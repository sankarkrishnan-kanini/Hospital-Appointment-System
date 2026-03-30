import { PrismaService } from '../prisma/prisma.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';
export declare class OfficeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__OfficeClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateOfficeDto): import(".prisma/client").Prisma.Prisma__OfficeClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateOfficeDto): import(".prisma/client").Prisma.Prisma__OfficeClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__OfficeClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
