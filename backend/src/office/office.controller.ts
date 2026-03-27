import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';

@Controller('office')
export class OfficeController {

  constructor(private readonly officeService: OfficeService) {}

  @Get()
  findAll() {
    return this.officeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.officeService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOfficeDto) {
    return this.officeService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateOfficeDto>) {
    return this.officeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.officeService.remove(id);
  }
}
