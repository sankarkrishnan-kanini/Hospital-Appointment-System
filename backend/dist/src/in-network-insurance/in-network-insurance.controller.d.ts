import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceController {
    private readonly inNetworkInsuranceService;
    constructor(inNetworkInsuranceService: InNetworkInsuranceService);
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
    create(dto: CreateInNetworkInsuranceDto): import(".prisma/client").Prisma.Prisma__InNetworkInsuranceClient<{
        id: number;
        officeId: number;
        insuranceName: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateInNetworkInsuranceDto): import(".prisma/client").Prisma.Prisma__InNetworkInsuranceClient<{
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
