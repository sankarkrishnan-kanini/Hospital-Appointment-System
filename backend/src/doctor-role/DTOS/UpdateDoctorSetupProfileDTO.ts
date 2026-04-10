import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateDoctorSetupProfileDTO {
  @ApiProperty({ example: 'Mounika', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'B', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Experienced cardiologist', required: false })
  @IsString()
  @IsOptional()
  professionalStatement?: string;

  @ApiProperty({ example: '2020-01-01', required: false })
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  practicingFrom?: Date;
}
