import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAppointmentHistoryDto {
  @IsInt()
  @IsNotEmpty()
  appointmentId: number;

  @IsInt()
  @IsNotEmpty()
  oldTimeSlotId: number;

  @IsInt()
  @IsNotEmpty()
  newTimeSlotId: number;
}
