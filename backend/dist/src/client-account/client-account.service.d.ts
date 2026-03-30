import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';
export declare class ClientAccountService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    create(data: CreateClientAccountDto): import(".prisma/client").Prisma.Prisma__ClientAccountClient<{
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        contactNumber: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateClientAccountDto): import(".prisma/client").Prisma.Prisma__ClientAccountClient<{
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
