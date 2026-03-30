import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentHistoryDto } from './createAppointmentHistoryDTO';

export class UpdateAppointmentHistoryDto extends PartialType(CreateAppointmentHistoryDto) {}
