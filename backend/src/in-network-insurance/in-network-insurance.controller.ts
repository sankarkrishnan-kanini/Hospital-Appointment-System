import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';

@Controller('in-network-insurance')
export class InNetworkInsuranceController {

  constructor(private readonly inNetworkInsuranceService: InNetworkInsuranceService) {}

  // GET /in-network-insurance
  @Get()
  async findAll() {
    return await this.inNetworkInsuranceService.findAll();
  }

  // GET /in-network-insurance/search?name=BlueCross
  @Get('search')
  async search(@Query('name') name: string) {
    return await this.inNetworkInsuranceService.search(name);
  }

  // GET /in-network-insurance/office/:officeId
  @Get('office/:officeId')
  async findByOffice(@Param('officeId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) officeId: number) {
    return await this.inNetworkInsuranceService.findByOffice(officeId);
  }

  // GET /in-network-insurance/:id
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.inNetworkInsuranceService.findOne(id);
  }

  // POST /in-network-insurance
  @Post()
  async create(@Body() dto: CreateInNetworkInsuranceDto) {
    return await this.inNetworkInsuranceService.create(dto);
  }

  // PATCH /in-network-insurance/:id
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateInNetworkInsuranceDto
  ) {
    return await this.inNetworkInsuranceService.update(id, dto);
  }

  // DELETE /in-network-insurance/office/:officeId/all
  @Delete('office/:officeId/all')
  async removeAllByOffice(@Param('officeId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) officeId: number) {
    return await this.inNetworkInsuranceService.removeAllByOffice(officeId);
  }

  // DELETE /in-network-insurance/:id
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.inNetworkInsuranceService.remove(id);
  }
}
