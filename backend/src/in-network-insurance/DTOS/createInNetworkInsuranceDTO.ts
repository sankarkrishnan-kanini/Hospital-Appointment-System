import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateInNetworkInsuranceDto {
  @IsInt()
  @IsNotEmpty()
  officeId: number;

  @IsString()
  @IsNotEmpty()
  insuranceName: string;
}
