import { PrismaService } from '../prisma/prisma.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
export declare class InNetworkInsuranceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        doctorHospital: {
            id: number;
            doctorId: number;
            city: string | null;
            country: string | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string | null;
            state: string | null;
            zip: string | null;
            hospitalId: number | null;
            isPrivate: boolean;
        };
    } & {
        id: number;
        insuranceName: string;
        doctorHospitalId: number;
    })[]>;
    findOne(id: number): Promise<{
        doctorHospital: {
            id: number;
            doctorId: number;
            city: string | null;
            country: string | null;
            timeSlotPerClientInMin: number;
            firstConsultationFee: number;
            followupConsultationFee: number;
            streetAddress: string | null;
            state: string | null;
            zip: string | null;
            hospitalId: number | null;
            isPrivate: boolean;
        };
    } & {
        id: number;
        insuranceName: string;
        doctorHospitalId: number;
    }>;
    create(userId: number, data: CreateInNetworkInsuranceDto): Promise<{
        id: number;
        insuranceName: string;
        doctorHospitalId: number;
    }>;
    update(userId: number, id: number, data: UpdateInNetworkInsuranceDto): Promise<{
        id: number;
        insuranceName: string;
        doctorHospitalId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        id: number;
        insuranceName: string;
        doctorHospitalId: number;
    }>;
}
