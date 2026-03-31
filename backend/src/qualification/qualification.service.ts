import { Injectable } from '@nestjs/common';
import {CreateQualificationDTO} from './DTOS/CreateQualificationDTO';
import {UpdateQualificationDTO} from './DTOS/UpdateQualificationDTO';
import {PrismaService} from '../prisma/prisma.service';
@Injectable()
export class QualificationService {
	
	constructor(private readonly prisma:PrismaService)
	{}
	
		create(dto: CreateQualificationDTO) {
		return this.prisma.qualification.create({
		  data: {
			...dto,
			procurementYear: dto.procurementYear
			  ? new Date(dto.procurementYear)
			  : null,
		  },
		});
	  }

	  findAll() {
		return this.prisma.qualification.findMany({
		  include: { doctor: true },
		});
	  }

	  findOne(id: number) {
		return this.prisma.qualification.findUnique({
		  where: { id },
		});
	  }

	  update(id: number, dto: UpdateQualificationDTO) {
		return this.prisma.qualification.update({
		  where: { id },
		  data: {
			...dto,
			procurementYear: dto.procurementYear
			  ? new Date(dto.procurementYear)
			  : undefined,
		  },
		});
	  }

	  remove(id: number) {
		return this.prisma.qualification.delete({
		  where: { id },
		});
	  }
		
	
}
