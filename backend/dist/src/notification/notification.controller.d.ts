import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
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
    create(dto: CreateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: number;
        createdAt: Date;
        userId: number;
        message: string;
        isRead: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateNotificationDto): import(".prisma/client").Prisma.Prisma__NotificationClient<{
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
