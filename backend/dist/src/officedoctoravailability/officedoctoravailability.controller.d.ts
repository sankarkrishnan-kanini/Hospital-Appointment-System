import { createofficedoctoravailabilityDTO } from './DTOS/creareofficedoctoravailabilityDTO';
import { UpdateOfficeDoctorAvailabilityDTO } from './DTOS/updateofficedoctoravailabilityDTO';
import { OfficedoctoravailabilityService } from './officedoctoravailability.service';
export declare class OfficedoctoravailabilityController {
    private readonly service;
    constructor(service: OfficedoctoravailabilityService);
    create(dto: createofficedoctoravailabilityDTO): Promise<import("@nestjs/common").BadRequestException | {
        id: number;
        officeId: number;
        reason: string | null;
        dayOfWeek: string;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
    }>;
    findAll(officeId: number): Promise<{
        id: number;
        officeId: number;
        reason: string | null;
        dayOfWeek: string;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        officeId: number;
        reason: string | null;
        dayOfWeek: string;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
    }>;
    update(id: number, dto: UpdateOfficeDoctorAvailabilityDTO): Promise<{
        id: number;
        officeId: number;
        reason: string | null;
        dayOfWeek: string;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        officeId: number;
        reason: string | null;
        dayOfWeek: string;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
    }>;
}
