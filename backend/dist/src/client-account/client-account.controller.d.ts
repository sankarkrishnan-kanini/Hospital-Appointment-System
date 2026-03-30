import { ClientAccountService } from './client-account.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';
export declare class ClientAccountController {
    private readonly clientAccountService;
    constructor(clientAccountService: ClientAccountService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__ClientAccountClient<{
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(dto: CreateClientAccountDto): import(".prisma/client").Prisma.Prisma__ClientAccountClient<{
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateClientAccountDto): import(".prisma/client").Prisma.Prisma__ClientAccountClient<{
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__ClientAccountClient<{
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
