import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDocumentDto } from './createDoctorDocumentDTO';

export class UpdateDoctorDocumentDto extends PartialType(CreateDoctorDocumentDto) {}
