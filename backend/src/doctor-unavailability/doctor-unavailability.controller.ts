import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';

@Controller('doctor-unavailability')
export class DoctorUnavailabilityController {

  constructor(private readonly doctorUnavailabilityService: DoctorUnavailabilityService) {}

  // GET /doctor-unavailability
  @Get()
  async findAll() {
    return await this.doctorUnavailabilityService.findAll();
  }

  // GET /doctor-unavailability/doctor/:doctorId
  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.doctorUnavailabilityService.findByDoctor(doctorId);
  }

  // GET /doctor-unavailability/doctor/:doctorId/upcoming
  @Get('doctor/:doctorId/upcoming')
  async findUpcoming(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.doctorUnavailabilityService.findUpcoming(doctorId);
  }

  // GET /doctor-unavailability/doctor/:doctorId/check?date=YYYY-MM-DD
  @Get('doctor/:doctorId/check')
  async checkUnavailability(
    @Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number,
    @Query('date') date: string
  ) {
    return await this.doctorUnavailabilityService.checkUnavailability(doctorId, date);
  }

  // GET /doctor-unavailability/:id
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorUnavailabilityService.findOne(id);
  }

  // POST /doctor-unavailability
  @Post()
  async create(@Body() dto: CreateDoctorUnavailabilityDto) {
    return await this.doctorUnavailabilityService.create(dto);
  }

  // PATCH /doctor-unavailability/:id
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateDoctorUnavailabilityDto
  ) {
    return await this.doctorUnavailabilityService.update(id, dto);
  }

  // DELETE /doctor-unavailability/doctor/:doctorId/clear-past
  @Delete('doctor/:doctorId/clear-past')
  async clearPast(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.doctorUnavailabilityService.clearPast(doctorId);
  }

  // DELETE /doctor-unavailability/:id
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorUnavailabilityService.remove(id);
  }
}
