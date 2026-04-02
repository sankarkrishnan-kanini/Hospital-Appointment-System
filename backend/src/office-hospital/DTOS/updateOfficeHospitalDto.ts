import { PartialType } from '@nestjs/swagger';
import { CreateOfficeDto } from '../../office/DTOS/createOfficeDTO';
import { CreateHospitalDto } from './createHospitalDto';

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {}
export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {}
