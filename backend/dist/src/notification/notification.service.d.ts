import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        userId: number;
        message: string;
        isRead: boolean;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: number;
        createdAt: Date;
        userId: number;
        message: string;
        isRead: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: CreateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: number;
        createdAt: Date;
        userId: number;
        message: string;
        isRead: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: number;
        createdAt: Date;
        userId: number;
        message: string;
        isRead: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: number;
        createdAt: Date;
        userId: number;
        message: string;
        isRead: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
