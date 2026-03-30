import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './createAppointmentDTO';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
