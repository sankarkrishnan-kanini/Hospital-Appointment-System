import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { CreateClientAccountDto } from './DTOS/createClientAccountDTO';
import { UpdateClientAccountDto } from './DTOS/updateClientAccountDTO';

@Controller('client-account')
export class ClientAccountController {

  constructor(private readonly clientAccountService: ClientAccountService) {}

  @Get()
  findAll() {
    return this.clientAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.clientAccountService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClientAccountDto) {
    return this.clientAccountService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateClientAccountDto) {
    return this.clientAccountService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.clientAccountService.remove(id);
  }
}
