import { IsInt, IsString, IsArray, ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateDoctorDocumentDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsArray()
  @ArrayNotEmpty()
  fileUrl: number[];
}
