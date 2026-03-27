import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';

@Controller('client-account')
export class ClientAccountController {

  constructor(private readonly clientAccountService: ClientAccountService) {}

  @Get()
  findAll() {
    return this.clientAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientAccountService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClientAccountDto) {
    return this.clientAccountService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateClientAccountDto>) {
    return this.clientAccountService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientAccountService.remove(id);
  }
}
