import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';
import { CreateDoctorUnavailabilityDto } from './DTOS/createDoctorUnavailabilityDTO';
import { UpdateDoctorUnavailabilityDto } from './DTOS/updateDoctorUnavailabilityDTO';

@Controller('doctor-unavailability')
export class DoctorUnavailabilityController {

  constructor(private readonly doctorUnavailabilityService: DoctorUnavailabilityService) {}

  @Get()
  async findAll() {
    return await this.doctorUnavailabilityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorUnavailabilityService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateDoctorUnavailabilityDto) {
    return await this.doctorUnavailabilityService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateDoctorUnavailabilityDto) {
    return await this.doctorUnavailabilityService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorUnavailabilityService.remove(id);
  }
}
