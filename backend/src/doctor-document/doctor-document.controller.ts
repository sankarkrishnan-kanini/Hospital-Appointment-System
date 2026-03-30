import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DoctorDocumentService } from './doctor-document.service';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';
import { UpdateDoctorDocumentDto } from './DTOS/updateDoctorDocumentDTO';

@Controller('doctor-document')
export class DoctorDocumentController {

  constructor(private readonly doctorDocumentService: DoctorDocumentService) {}

  @Get()
  findAll() {
    return this.doctorDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorDocumentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDoctorDocumentDto) {
    return this.doctorDocumentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateDoctorDocumentDto) {
    return this.doctorDocumentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorDocumentService.remove(id);
  }
}
