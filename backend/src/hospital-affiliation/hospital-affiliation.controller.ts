import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { HospitalAffiliationService } from './hospital-affiliation.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';
import { UpdateHospitalAffiliationDto } from './DTOS/updateHospitalAffiliationDTO';

@Controller('hospital-affiliation')
export class HospitalAffiliationController {

  constructor(private readonly hospitalAffiliationService: HospitalAffiliationService) {}

  @Get()
  async findAll() {
    return await this.hospitalAffiliationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.hospitalAffiliationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateHospitalAffiliationDto) {
    return await this.hospitalAffiliationService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateHospitalAffiliationDto) {
    return await this.hospitalAffiliationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.hospitalAffiliationService.remove(id);
  }
}
