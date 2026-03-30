import { OfficeService } from './office.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';
export declare class OfficeController {
    private readonly officeService;
    constructor(officeService: OfficeService);
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
    create(dto: CreateOfficeDto): import(".prisma/client").Prisma.Prisma__OfficeClient<{
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
    update(id: number, dto: UpdateOfficeDto): import(".prisma/client").Prisma.Prisma__OfficeClient<{
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
