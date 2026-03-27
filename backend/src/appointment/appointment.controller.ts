import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';

@Controller('appointment')
export class AppointmentController {

  constructor(private readonly appointmentService: AppointmentService) {}

  // GET /appointment
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  // GET /appointment/1
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  // POST /appointment
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  // PATCH /appointment/1
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateAppointmentDto>) {
    return this.appointmentService.update(id, data);
  }

  // DELETE /appointment/1
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}
