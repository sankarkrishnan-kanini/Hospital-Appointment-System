import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceController {
    private readonly inNetworkInsuranceService;
    constructor(inNetworkInsuranceService: InNetworkInsuranceService);
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
    create(dto: CreateInNetworkInsuranceDto): Promise<{
        officeId: number;
        id: number;
        insuranceName: string;
    }>;
    update(id: number, dto: UpdateInNetworkInsuranceDto): Promise<{
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
