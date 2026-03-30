import { ClientAccountService } from './client-account.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';
export declare class ClientAccountController {
    private readonly clientAccountService;
    constructor(clientAccountService: ClientAccountService);
    findAll(): Promise<{
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
    } | null>;
    create(dto: CreateClientAccountDto): Promise<{
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
    }>;
    update(id: number, dto: UpdateClientAccountDto): Promise<{
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
    }>;
}
