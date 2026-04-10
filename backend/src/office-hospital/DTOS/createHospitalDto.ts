import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHospitalDto {
  @ApiProperty({ example: 'Apollo Hospital' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty({ example: 'Hyderabad' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Telangana' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '500001' })
  @IsString()
  @IsNotEmpty()
  zip: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultFirstConsultationFee?: number;

  @ApiProperty({ example: 300 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  defaultFollowupFee?: number;
}
