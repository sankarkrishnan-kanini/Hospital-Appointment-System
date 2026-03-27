import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';

@Controller('in-network-insurance')
export class InNetworkInsuranceController {

  constructor(private readonly inNetworkInsuranceService: InNetworkInsuranceService) {}

  @Get()
  findAll() {
    return this.inNetworkInsuranceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inNetworkInsuranceService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInNetworkInsuranceDto) {
    return this.inNetworkInsuranceService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateInNetworkInsuranceDto>) {
    return this.inNetworkInsuranceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inNetworkInsuranceService.remove(id);
  }
}
