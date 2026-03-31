import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentStatusService } from './appointment-status.service';
import { CreateAppointmentStatusDto } from './DTOS/createAppointmentStatusDTO';
import { UpdateAppointmentStatusDto } from './DTOS/updateAppointmentStatusDTO';

@Controller('appointment-status')
export class AppointmentStatusController {

  constructor(private readonly appointmentStatusService: AppointmentStatusService) {}

  @Get()
  async findAll() {
    return await this.appointmentStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.appointmentStatusService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAppointmentStatusDto) {
    return await this.appointmentStatusService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateAppointmentStatusDto) {
    return await this.appointmentStatusService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.appointmentStatusService.remove(id);
  }
}
