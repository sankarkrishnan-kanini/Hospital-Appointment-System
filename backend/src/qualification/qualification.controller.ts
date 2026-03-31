import { Controller,Get,Post,Patch,Delete,Body,Param,ParseIntPipe } from '@nestjs/common';
import {CreateQualificationDTO} from './DTOS/CreateQualificationDTO';
import {UpdateQualificationDTO} from './DTOS/UpdateQualificationDTO';
import { QualificationService } from './qualification.service';
import { UseFilters } from '@nestjs/common';
import { CustomExceptionFilter } from 'src/CustomExceptionFilter';
import { HttpStatus } from '@nestjs/common';
@Controller('qualification')
export class QualificationController {
	constructor(private readonly qualificationService:QualificationService)
	{}
	
	  @Post()
	  @UseFilters(new CustomExceptionFilter())
	  create(@Body() dto: CreateQualificationDTO) {
		return this.qualificationService.create(dto);
	  }

	  @Get()
	  @UseFilters(new CustomExceptionFilter())
	  findAll() {
		return this.qualificationService.findAll();
	  }

	  @Get(':id')
	  @UseFilters(new CustomExceptionFilter())
	  findOne(@Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number) {
		return this.qualificationService.findOne(id);
	  }

	  @Patch(':id')
	  @UseFilters(new CustomExceptionFilter())
	  update(
		@Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number,
		@Body() dto: UpdateQualificationDTO,
	  ) {
		return this.qualificationService.update(id, dto);
	  }

	  @Delete(':id')
	  @UseFilters(new CustomExceptionFilter())
	  remove(@Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number) {
		return this.qualificationService.remove(id);
	  }
	
	
}
