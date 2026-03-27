export class CreateNotificationDto {
  userId: number;
  message: string;
  isRead?: boolean;
}
