import {IsInt, IsString, Matches, IsOptional, IsBoolean} from 'class-validator';

export class createofficedoctoravailabilityDTO{
  
  @IsInt()
  office_id: number;

  @IsString()
  day_of_week: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  start_time: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  end_time: string;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @IsOptional()
  @IsString()
  reason_of_unavailability?: string;
  
}