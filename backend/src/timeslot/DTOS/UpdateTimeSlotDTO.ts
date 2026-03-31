import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeSlotDTO } from './CreateTimeSlotDTO';

export class UpdateTimeSlotDTO extends PartialType(CreateTimeSlotDTO) {}