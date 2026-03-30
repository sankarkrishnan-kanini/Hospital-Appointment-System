import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './createNotificationDTO';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
