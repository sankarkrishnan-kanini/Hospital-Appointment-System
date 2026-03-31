import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentHistoryService } from './appointment-history.service';
import { CreateAppointmentHistoryDto } from './DTOS/createAppointmentHistoryDTO';
import { UpdateAppointmentHistoryDto } from './DTOS/updateAppointmentHistoryDTO';

@Controller('appointment-history')
export class AppointmentHistoryController {

  constructor(private readonly appointmentHistoryService: AppointmentHistoryService) {}

  @Get()
  async findAll() {
    return await this.appointmentHistoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.appointmentHistoryService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateAppointmentHistoryDto) {
    return await this.appointmentHistoryService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateAppointmentHistoryDto) {
    return await this.appointmentHistoryService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.appointmentHistoryService.remove(id);
  }
}
