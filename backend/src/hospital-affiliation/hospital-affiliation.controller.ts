import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HospitalAffiliationService } from './hospital-affiliation.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';

@Controller('hospital-affiliation')
export class HospitalAffiliationController {

  constructor(private readonly hospitalAffiliationService: HospitalAffiliationService) {}

  @Get()
  findAll() {
    return this.hospitalAffiliationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalAffiliationService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateHospitalAffiliationDto) {
    return this.hospitalAffiliationService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateHospitalAffiliationDto>) {
    return this.hospitalAffiliationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalAffiliationService.remove(id);
  }
}
