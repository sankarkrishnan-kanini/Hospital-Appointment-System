import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { InNetworkInsuranceService } from './in-network-insurance.service';
import { CreateInNetworkInsuranceDto } from './DTOS/createInNetworkInsuranceDTO';
import { UpdateInNetworkInsuranceDto } from './DTOS/updateInNetworkInsuranceDTO';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { User } from 'src/auth/user.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('in-network-insurance')
export class InNetworkInsuranceController {

  constructor(private readonly inNetworkInsuranceService: InNetworkInsuranceService) {}

  @Get()
  findAll() {
    return this.inNetworkInsuranceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.inNetworkInsuranceService.findOne(id);
  }

  @Post()
  @Roles(Role.Doctor)
  @UseGuards(RoleGuard)
  create(
    @User('sub', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number,
    @Body() dto: CreateInNetworkInsuranceDto
  ) {
    return this.inNetworkInsuranceService.create(userId, dto);
  }

  @Patch(':id')
  @Roles(Role.Doctor)
  @UseGuards(RoleGuard)
  update(
    @User('sub', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateInNetworkInsuranceDto
  ) {
    return this.inNetworkInsuranceService.update(userId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.Doctor)
  @UseGuards(RoleGuard)
  remove(
    @User('sub', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.inNetworkInsuranceService.remove(userId, id);
  }
}
