import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppointmentStatusService } from './appointment-status.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';

@Controller('appointment-status')
export class AppointmentStatusController {

  constructor(private readonly appointmentStatusService: AppointmentStatusService) {}

  @Get()
  findAll() {
    return this.appointmentStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentStatusService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAppointmentStatusDto) {
    return this.appointmentStatusService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateAppointmentStatusDto>) {
    return this.appointmentStatusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentStatusService.remove(id);
  }
}
