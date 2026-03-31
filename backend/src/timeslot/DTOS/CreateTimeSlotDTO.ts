import { IsInt, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTimeSlotDTO {
  @IsInt()
  officeId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsBoolean()
  isBooked?: boolean;
}