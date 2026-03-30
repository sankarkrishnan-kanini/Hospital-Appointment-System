import { PrismaService } from '../prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__InNetworkInsuranceClient<{
        id: number;
        officeId: number;
        insuranceName: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateInNetworkInsuranceDto): import(".prisma/client").Prisma.Prisma__InNetworkInsuranceClient<{
        id: number;
        officeId: number;
        insuranceName: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateInNetworkInsuranceDto): import(".prisma/client").Prisma.Prisma__InNetworkInsuranceClient<{
        id: number;
        officeId: number;
        insuranceName: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__InNetworkInsuranceClient<{
        id: number;
        officeId: number;
        insuranceName: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
