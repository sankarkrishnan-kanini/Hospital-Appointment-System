import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';
export declare class ClientAccountService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    create(data: CreateClientAccountDto): Promise<{
        id: number;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
        email: string;
    }>;
    update(id: number, data: UpdateClientAccountDto): Promise<{
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
