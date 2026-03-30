import { HospitalAffiliationService } from './hospital-affiliation.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';
import { UpdateHospitalAffiliationDto } from './DTOS/updateHospitalAffiliationDTO';
export declare class HospitalAffiliationController {
    private readonly hospitalAffiliationService;
    constructor(hospitalAffiliationService: HospitalAffiliationService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        doctorId: number;
        hospitalName: string;
        city: string;
        country: string;
        startDate: Date | null;
        endDate: Date | null;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__HospitalAffiliationClient<{
        id: number;
        doctorId: number;
        hospitalName: string;
        city: string;
        country: string;
        startDate: Date | null;
        endDate: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateHospitalAffiliationDto): import(".prisma/client").Prisma.Prisma__HospitalAffiliationClient<{
        id: number;
        doctorId: number;
        hospitalName: string;
        city: string;
        country: string;
        startDate: Date | null;
        endDate: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateHospitalAffiliationDto): import(".prisma/client").Prisma.Prisma__HospitalAffiliationClient<{
        id: number;
        doctorId: number;
        hospitalName: string;
        city: string;
        country: string;
        startDate: Date | null;
        endDate: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__HospitalAffiliationClient<{
        id: number;
        doctorId: number;
        hospitalName: string;
        city: string;
        country: string;
        startDate: Date | null;
        endDate: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
