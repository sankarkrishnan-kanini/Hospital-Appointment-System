import { PrismaService } from '../prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    } | null>;
    create(data: CreateInNetworkInsuranceDto): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }>;
    update(id: number, data: UpdateInNetworkInsuranceDto): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }>;
}
