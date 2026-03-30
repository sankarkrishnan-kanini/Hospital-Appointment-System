import { IsInt, IsDate, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDoctorUnavailabilityDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  reason?: string;
}
