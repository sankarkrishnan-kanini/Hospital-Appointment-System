import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';

@Controller('doctor-specialization')
export class DoctorSpecializationController {

  constructor(private readonly doctorSpecializationService: DoctorSpecializationService) {}

  @Get()
  findAll() {
    return this.doctorSpecializationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSpecializationService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorSpecializationDto) {
    return this.doctorSpecializationService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateDoctorSpecializationDto>) {
    return this.doctorSpecializationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSpecializationService.remove(id);
  }
}
