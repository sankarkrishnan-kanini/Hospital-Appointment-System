import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';

@Controller('appointment')
export class AppointmentController {

  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async findAll() {
    return await this.appointmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.appointmentService.findOne(id);
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.create(createAppointmentDto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() data: UpdateAppointmentDto) {
    return await this.appointmentService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.appointmentService.remove(id);
  }
}
