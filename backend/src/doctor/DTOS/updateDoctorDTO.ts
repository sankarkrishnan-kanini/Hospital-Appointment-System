import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './createDoctorDTO';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
