import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceController {
    private readonly inNetworkInsuranceService;
    constructor(inNetworkInsuranceService: InNetworkInsuranceService);
    findAll(): Promise<({
        office: {
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
        };
    } & {
        id: number;
        officeId: number;
        insuranceName: string;
    })[]>;
    search(name: string): Promise<({
        office: {
            doctor: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                firstName: string;
                lastName: string;
                professionalStatement: string | null;
                practicingFrom: Date | null;
                isVerified: boolean;
                verificationRequested: boolean;
            };
        } & {
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
        };
    } & {
        id: number;
        officeId: number;
        insuranceName: string;
    })[]>;
    findByOffice(officeId: number): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }[]>;
    findOne(id: number): Promise<{
        office: {
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
        };
    } & {
        id: number;
        officeId: number;
        insuranceName: string;
    }>;
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
    removeAllByOffice(officeId: number): Promise<{
        deleted: number;
        message: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        officeId: number;
        insuranceName: string;
    }>;
}
