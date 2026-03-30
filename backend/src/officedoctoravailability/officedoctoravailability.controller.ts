import { Controller,Post,Get,Patch,Delete,ParseIntPipe,Param,Query,Body,HttpException,HttpStatus, UseFilters } from '@nestjs/common';
import { createofficedoctoravailabilityDTO } from './DTOS/creareofficedoctoravailabilityDTO';
import { UpdateOfficeDoctorAvailabilityDTO } from './DTOS/updateofficedoctoravailabilityDTO';
import { OfficedoctoravailabilityService } from './officedoctoravailability.service';
import { CustomExceptionFilter } from 'src/CustomExceptionFilter';

@Controller('officedoctoravailability')
export class OfficedoctoravailabilityController {
      constructor(
    private readonly service: OfficedoctoravailabilityService,
  ) {}

  @Post()
  @UseFilters(new CustomExceptionFilter())
  create(@Body() dto: createofficedoctoravailabilityDTO ) {
    return this.service.create(dto);
  }
  @Get()
  @UseFilters(new CustomExceptionFilter())
  findAll(@Query('officeId', new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	})) officeId: number) {
    
		
	   return this.service.findAll(officeId);	
	
  }
  @Get(':id')
  @UseFilters(new CustomExceptionFilter())
  findOne(@Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number) {
   
		
	  return this.service.findOne(id);	
	
  }
  @Patch(':id')
  @UseFilters(new CustomExceptionFilter())
  update(
    @Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number,
    @Body() dto: UpdateOfficeDoctorAvailabilityDTO,
  ) {
    
	    return this.service.update(id, dto);	 
	
  }
  @Delete(':id')
    @UseFilters(new CustomExceptionFilter())
  remove(@Param('id',new ParseIntPipe({ errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE
	}))id:number) {
   
		
	return this.service.remove(id);	
	
  }

}
