import { PrismaService } from '../prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        officeId: number;
        id: number;
        insuranceName: string;
    }[]>;
    findOne(id: number): Promise<{
        officeId: number;
        id: number;
        insuranceName: string;
    } | null>;
    create(data: CreateInNetworkInsuranceDto): Promise<{
        officeId: number;
        id: number;
        insuranceName: string;
    }>;
    update(id: number, data: UpdateInNetworkInsuranceDto): Promise<{
        officeId: number;
        id: number;
        insuranceName: string;
    }>;
    remove(id: number): Promise<{
        officeId: number;
        id: number;
        insuranceName: string;
    }>;
}
