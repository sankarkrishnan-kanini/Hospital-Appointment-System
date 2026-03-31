import { IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateQualificationDTO {
  @IsInt()
  doctorId: number;

  @IsString()
  qualificationName: string;

  @IsString()
  instituteName: string;

  @IsOptional()
  @IsDateString()
  procurementYear?: string;
}

