import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './DTOS/createDoctorDTO';

@Controller('doctor')
export class DoctorController {

  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateDoctorDto>) {
    return this.doctorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.remove(id);
  }
}
