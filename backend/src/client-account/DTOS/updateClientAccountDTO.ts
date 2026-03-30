import { PartialType } from '@nestjs/mapped-types';
import { CreateClientAccountDto } from './createClientAccountDTO';

export class UpdateClientAccountDto extends PartialType(CreateClientAccountDto) {}
