import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentStatusService } from './appointment-status.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';
import { UpdateAppointmentStatusDto } from './DTOS/updateAppointmentStatusDTO';

@Controller('appointment-status')
export class AppointmentStatusController {

  constructor(private readonly appointmentStatusService: AppointmentStatusService) {}

  @Get()
  findAll() {
    return this.appointmentStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentStatusService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAppointmentStatusDto) {
    return this.appointmentStatusService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateAppointmentStatusDto) {
    return this.appointmentStatusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentStatusService.remove(id);
  }
}
