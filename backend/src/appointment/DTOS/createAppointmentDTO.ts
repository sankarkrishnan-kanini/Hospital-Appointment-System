import { IsInt, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  userAccountId: number;

  @IsInt()
  @IsNotEmpty()
  officeId: number;

  @IsInt()
  @IsNotEmpty()
  timeSlotId: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  probableStartTime: Date;

  @IsInt()
  @IsNotEmpty()
  durationInMinutes: number;

  @IsInt()
  @IsNotEmpty()
  appointmentStatusId: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  appointmentTakenDate: Date;
}
