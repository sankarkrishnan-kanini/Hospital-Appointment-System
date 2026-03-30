import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';

@Controller('doctor-unavailability')
export class DoctorUnavailabilityController {

  constructor(private readonly doctorUnavailabilityService: DoctorUnavailabilityService) {}

  @Get()
  findAll() {
    return this.doctorUnavailabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorUnavailabilityService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorUnavailabilityDto) {
    return this.doctorUnavailabilityService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateDoctorUnavailabilityDto) {
    return this.doctorUnavailabilityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorUnavailabilityService.remove(id);
  }
}
