import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
import { BookAppointmentDto } from './DTOS/bookAppointmentDTO';
import { CancelAppointmentDto } from './DTOS/cancelAppointmentDTO';
import { RescheduleAppointmentDto } from './DTOS/rescheduleAppointmentDTO';

@Controller('appointment')
export class AppointmentController {

  constructor(private readonly appointmentService: AppointmentService) {}

  // GET /appointment
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  
  // GET /appointment/client/:clientId
  @Get('client/:clientId')
  getClientAppointments(
    @Param('clientId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) clientId: number
  ) {
    return this.appointmentService.getClientAppointments(clientId);
  }

  // GET /appointment/doctor/:doctorId
  @Get('doctor/:doctorId')
  getDoctorAppointments(
    @Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number
  ) {
    return this.appointmentService.getDoctorAppointments(doctorId);
  }

  // GET /appointment/:id/details
  @Get(':id/details')
  getAppointmentDetails(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.appointmentService.getAppointmentDetails(id);
  }

  // GET /appointment/:id/history
  @Get(':id/history')
  getAppointmentHistory(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.appointmentService.getAppointmentHistory(id);
  }

  // GET /appointment/1
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentService.findOne(id);
  }

  // POST /appointment/book
  @Post('book')
  bookAppointment(@Body() dto: BookAppointmentDto) {
    return this.appointmentService.bookAppointment(dto);
  }

  // POST /appointment
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  // PATCH /appointment/:id/reschedule
  @Patch(':id/reschedule')
  rescheduleAppointment(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: RescheduleAppointmentDto
  ) {
    return this.appointmentService.rescheduleAppointment(id, dto);
  }

  // PATCH /appointment/:id/cancel
  @Patch(':id/cancel')
  cancelAppointment(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: CancelAppointmentDto
  ) {
    return this.appointmentService.cancelAppointment(id, dto);
  }

  // PATCH /appointment/1
  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() data: UpdateAppointmentDto) {
    return this.appointmentService.update(id, data);
  }

  // DELETE /appointment/1
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentService.remove(id);
  }
}
