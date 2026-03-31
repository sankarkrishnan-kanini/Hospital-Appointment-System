import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceController {
    private readonly inNetworkInsuranceService;
    constructor(inNetworkInsuranceService: InNetworkInsuranceService);
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
    create(dto: CreateInNetworkInsuranceDto): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }>;
    update(id: number, dto: UpdateInNetworkInsuranceDto): Promise<{
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
