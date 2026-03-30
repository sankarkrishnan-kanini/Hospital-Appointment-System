import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentStatusDto } from './createAppointmentStatusDTO';

export class UpdateAppointmentStatusDto extends PartialType(CreateAppointmentStatusDto) {}
