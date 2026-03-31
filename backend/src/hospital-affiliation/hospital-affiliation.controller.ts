import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { HospitalAffiliationService } from './hospital-affiliation.service';
import { CreateHospitalAffiliationDto } from './DTOS/createHospitalAffiliationDTO';
import { UpdateHospitalAffiliationDto } from './DTOS/updateHospitalAffiliationDTO';

@Controller('hospital-affiliation')
export class HospitalAffiliationController {

  constructor(private readonly hospitalAffiliationService: HospitalAffiliationService) {}

  // GET /hospital-affiliation
  @Get()
  async findAll() {
    return await this.hospitalAffiliationService.findAll();
  }

  // GET /hospital-affiliation/search?city=city&country=country
  @Get('search')
  async search(
    @Query('city') city?: string,
    @Query('country') country?: string
  ) {
    return await this.hospitalAffiliationService.search(city, country);
  }

  // GET /hospital-affiliation/doctor/:doctorId
  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.hospitalAffiliationService.findByDoctor(doctorId);
  }

  // GET /hospital-affiliation/doctor/:doctorId/active
  @Get('doctor/:doctorId/active')
  async findActiveByDoctor(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.hospitalAffiliationService.findActiveByDoctor(doctorId);
  }

  // GET /hospital-affiliation/:id
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.hospitalAffiliationService.findOne(id);
  }

  // POST /hospital-affiliation
  @Post()
  async create(@Body() dto: CreateHospitalAffiliationDto) {
    return await this.hospitalAffiliationService.create(dto);
  }

  // PATCH /hospital-affiliation/:id
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateHospitalAffiliationDto
  ) {
    return await this.hospitalAffiliationService.update(id, dto);
  }

  // DELETE /hospital-affiliation/:id
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.hospitalAffiliationService.remove(id);
  }
}
