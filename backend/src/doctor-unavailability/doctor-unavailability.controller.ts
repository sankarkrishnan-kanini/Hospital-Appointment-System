import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';

@Controller('doctor-unavailability')
export class DoctorUnavailabilityController {

  constructor(private readonly doctorUnavailabilityService: DoctorUnavailabilityService) {}

  @Get()
  findAll() {
    return this.doctorUnavailabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorUnavailabilityService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorUnavailabilityDto) {
    return this.doctorUnavailabilityService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateDoctorUnavailabilityDto>) {
    return this.doctorUnavailabilityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorUnavailabilityService.remove(id);
  }
}
