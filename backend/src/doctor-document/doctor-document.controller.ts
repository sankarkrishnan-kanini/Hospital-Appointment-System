import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DoctorDocumentService } from './doctor-document.service';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';
import { UpdateDoctorDocumentDto } from './DTOS/updateDoctorDocumentDTO';

@Controller('doctor-document')
export class DoctorDocumentController {

  constructor(private readonly doctorDocumentService: DoctorDocumentService) {}

  @Get()
  async findAll() {
    return await this.doctorDocumentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorDocumentService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateDoctorDocumentDto) {
    return await this.doctorDocumentService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateDoctorDocumentDto) {
    return await this.doctorDocumentService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorDocumentService.remove(id);
  }
}
