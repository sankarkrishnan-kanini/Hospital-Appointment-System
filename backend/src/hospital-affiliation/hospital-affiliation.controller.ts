import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { HospitalAffiliationService } from './hospital-affiliation.service';

@Controller('hospital')
export class HospitalAffiliationController {

  constructor(private readonly hospitalAffiliationService: HospitalAffiliationService) {}

  @Get()
  findAll() {
    return this.hospitalAffiliationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.hospitalAffiliationService.findOne(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.hospitalAffiliationService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: any
  ) {
    return this.hospitalAffiliationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.hospitalAffiliationService.remove(id);
  }

  @Get('office/:officeId')
  findByOffice(@Param('officeId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) officeId: number) {
    return this.hospitalAffiliationService.findByOffice(officeId);
  }
}
