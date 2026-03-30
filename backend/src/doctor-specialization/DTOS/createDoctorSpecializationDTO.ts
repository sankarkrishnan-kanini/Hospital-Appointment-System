import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDoctorSpecializationDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsInt()
  @IsNotEmpty()
  specializationId: number;
}
