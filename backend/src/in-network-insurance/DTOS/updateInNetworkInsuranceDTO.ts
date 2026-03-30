import { PartialType } from '@nestjs/mapped-types';
import { CreateInNetworkInsuranceDto } from './createInNetworkInsuranceDTO';

export class UpdateInNetworkInsuranceDto extends PartialType(CreateInNetworkInsuranceDto) {}
