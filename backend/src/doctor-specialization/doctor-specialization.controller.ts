import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';
import { UpdateDoctorSpecializationDto } from './DTOS/updateDoctorSpecializationDTO';

@Controller('doctor-specialization')
export class DoctorSpecializationController {

  constructor(private readonly doctorSpecializationService: DoctorSpecializationService) {}

  @Get()
  findAll() {
    return this.doctorSpecializationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorSpecializationService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorSpecializationDto) {
    return this.doctorSpecializationService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateDoctorSpecializationDto) {
    return this.doctorSpecializationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorSpecializationService.remove(id);
  }
}
