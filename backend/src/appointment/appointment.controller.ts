import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './DTOS/createAppointmentDTO';
import { UpdateAppointmentDto } from './DTOS/updateAppointmentDTO';
import { BookAppointmentDto } from './DTOS/bookAppointmentDTO';
import { CancelAppointmentDto } from './DTOS/cancelAppointmentDTO';
import { RescheduleAppointmentDto } from './DTOS/rescheduleAppointmentDTO';

@Controller('appointments')
export class AppointmentController {

  constructor(private readonly appointmentService: AppointmentService) {}

  // ─── BUSINESS LOGIC ENDPOINTS ───────────────────────────────────────────────

  // POST /appointments/book
  @Post('book')
  bookAppointment(@Body() dto: BookAppointmentDto) {
    return this.appointmentService.bookAppointment(dto);
  }

  // PATCH /appointments/:id/reschedule
  @Patch(':id/reschedule')
  rescheduleAppointment(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: RescheduleAppointmentDto
  ) {
    return this.appointmentService.rescheduleAppointment(id, dto);
  }

  // PATCH /appointments/:id/cancel
  @Patch(':id/cancel')
  cancelAppointment(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: CancelAppointmentDto
  ) {
    return this.appointmentService.cancelAppointment(id, dto);
  }

  // GET /appointments/client/:clientId
  @Get('client/:clientId')
  getClientAppointments(
    @Param('clientId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) clientId: number
  ) {
    return this.appointmentService.getClientAppointments(clientId);
  }

  // GET /appointments/doctor/:doctorId
  @Get('doctor/:doctorId')
  getDoctorAppointments(
    @Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number
  ) {
    return this.appointmentService.getDoctorAppointments(doctorId);
  }

  // GET /appointments/:id/details — specific routes before generic /:id
  @Get(':id/details')
  getAppointmentDetails(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.appointmentService.getAppointmentDetails(id);
  }

  // GET /appointments/:id/history
  @Get(':id/history')
  getAppointmentHistory(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.appointmentService.getAppointmentHistory(id);
  }

  // ─── ADMIN ONLY ENDPOINTS (restrict when auth is added) ─────────────────────

  // GET /appointments
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  // GET /appointments/:id
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentService.findOne(id);
  }

  // POST /appointments
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  // PATCH /appointments/:id
  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() data: UpdateAppointmentDto
  ) {
    return this.appointmentService.update(id, data);
  }

  // DELETE /appointments/:id
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.appointmentService.remove(id);
  }
}
