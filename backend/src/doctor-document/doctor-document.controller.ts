import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DoctorDocumentService } from './doctor-document.service';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';

@Controller('doctor-document')
export class DoctorDocumentController {

  constructor(private readonly doctorDocumentService: DoctorDocumentService) {}

  @Get()
  findAll() {
    return this.doctorDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorDocumentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorDocumentDto) {
    return this.doctorDocumentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateDoctorDocumentDto>) {
    return this.doctorDocumentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorDocumentService.remove(id);
  }
}
