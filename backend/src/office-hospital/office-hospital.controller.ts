import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { OfficeHospitalService } from './office-hospital.service';
import { CreateOfficeDto } from '../office/DTOS/createOfficeDTO';
import { CreateHospitalDto } from './DTOS/createHospitalDto';
import { UpdateOfficeDto, UpdateHospitalDto } from './DTOS/updateOfficeHospitalDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiBearerAuth()
@Roles(Role.Admin)
@Controller('admin')
export class OfficeHospitalController {

  constructor(private readonly officeHospitalService: OfficeHospitalService) {}

  // ─── OFFICE ───────────────────────────────────────────────────────────────────

  @Post('offices')
  createOffice(@Body() dto: CreateOfficeDto) {
    return this.officeHospitalService.createOffice(dto);
  }

  @Get('offices')
  getAllOffices() {
    return this.officeHospitalService.getAllOffices();
  }

  @Get('offices/:id')
  getOfficeById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.officeHospitalService.getOfficeById(id);
  }

  @Patch('offices/:id')
  updateOffice(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateOfficeDto
  ) {
    return this.officeHospitalService.updateOffice(id, dto);
  }

  // ─── HOSPITAL ─────────────────────────────────────────────────────────────────

  @Post('offices/:officeId/hospitals')
  createHospital(
    @Param('officeId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) officeId: number,
    @Body() dto: CreateHospitalDto
  ) {
    return this.officeHospitalService.createHospital(officeId, dto);
  }

  @Get('offices/:officeId/hospitals')
  getHospitalsByOffice(
    @Param('officeId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) officeId: number
  ) {
    return this.officeHospitalService.getHospitalsByOffice(officeId);
  }

  @Get('hospitals/:id')
  getHospitalById(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.officeHospitalService.getHospitalById(id);
  }

  @Patch('hospitals/:id')
  updateHospital(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateHospitalDto
  ) {
    return this.officeHospitalService.updateHospital(id, dto);
  }
}
