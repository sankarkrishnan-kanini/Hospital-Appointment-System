import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecializationDto } from './CreateSpecializationDto';

export class UpdateSpecializationDto extends PartialType(CreateSpecializationDto) {}