import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppointmentHistoryService } from './appointment-history.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';

@Controller('appointment-history')
export class AppointmentHistoryController {

  constructor(private readonly appointmentHistoryService: AppointmentHistoryService) {}

  @Get()
  findAll() {
    return this.appointmentHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentHistoryService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAppointmentHistoryDto) {
    return this.appointmentHistoryService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateAppointmentHistoryDto>) {
    return this.appointmentHistoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentHistoryService.remove(id);
  }
}
