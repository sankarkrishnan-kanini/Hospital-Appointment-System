import { Controller, HttpStatus, UseFilters } from '@nestjs/common';
import { CreateTimeSlotDTO } from './DTOS/CreateTimeSlotDTO';
import { TimeslotService } from './timeslot.service';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UpdateTimeSlotDTO } from './DTOS/UpdateTimeSlotDTO';
import { CustomExceptionFilter } from 'src/CustomExceptionFilter';
@Controller('timeslot')
export class TimeslotController {
    
   constructor(private readonly service: TimeslotService) {}

  @Post()
  @UseFilters(new CustomExceptionFilter())
  create(@Body() dto: CreateTimeSlotDTO) {
    return this.service.create(dto);
  }

  @Get()
   @UseFilters(new CustomExceptionFilter())
  findAll() {
    return this.service.findAll();
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
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateTimeSlotDTO,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
   @UseFilters(new CustomExceptionFilter())
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.service.remove(id);
  }

}
