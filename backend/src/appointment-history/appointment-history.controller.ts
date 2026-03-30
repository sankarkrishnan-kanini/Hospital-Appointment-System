import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentHistoryService } from './appointment-history.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';

@Controller('appointment-history')
export class AppointmentHistoryController {

  constructor(private readonly appointmentHistoryService: AppointmentHistoryService) {}

  @Get()
  findAll() {
    return this.appointmentHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentHistoryService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAppointmentHistoryDto) {
    return this.appointmentHistoryService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateAppointmentHistoryDto) {
    return this.appointmentHistoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentHistoryService.remove(id);
  }
}
