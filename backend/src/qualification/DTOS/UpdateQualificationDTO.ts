import{PartialType} from '@nestjs/mapped-types';
import {CreateQualificationDTO} from './CreateQualificationDTO';

export class UpdateQualificationDTO extends PartialType(CreateQualificationDTO){}