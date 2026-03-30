import { IsInt, IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOfficeDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsInt()
  @IsOptional()
  hospitalAffiliationId?: number;

  @IsInt()
  @IsNotEmpty()
  timeSlotPerClientInMin: number;

  @IsNumber()
  @IsNotEmpty()
  firstConsultationFee: number;

  @IsNumber()
  @IsNotEmpty()
  followupConsultationFee: number;

  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  zip: string;
}
