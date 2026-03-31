import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';

@Controller('office')
export class OfficeController {

  constructor(private readonly officeService: OfficeService) {}

  @Get()
  async findAll() {
    return await this.officeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.officeService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateOfficeDto) {
    return await this.officeService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateOfficeDto) {
    return await this.officeService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.officeService.remove(id);
  }
}
