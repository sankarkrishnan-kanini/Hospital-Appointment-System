import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './DTOS/createOfficeDTO';
import { UpdateOfficeDto } from './DTOS/updateOfficeDTO';

@Controller('office')
export class OfficeController {

  constructor(private readonly officeService: OfficeService) {}

  // GET /office
  @Get()
  async findAll() {
    return await this.officeService.findAll();
  }

  // GET /office/search?city=&state=&country=&maxFee=
  @Get('search')
  async search(
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
    @Query('maxFee') maxFee?: string
  ) {
    return await this.officeService.search(city, state, country, maxFee ? parseFloat(maxFee) : undefined);
  }

  // GET /office/doctor/:doctorId
  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.officeService.findByDoctor(doctorId);
  }

  // GET /office/:id/availability
  @Get(':id/availability')
  async getAvailability(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.officeService.getAvailability(id);
  }

  // GET /office/:id/timeslots/available?date=YYYY-MM-DD
  @Get(':id/timeslots/available')
  async getAvailableTimeSlots(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Query('date') date: string
  ) {
    return await this.officeService.getAvailableTimeSlots(id, date);
  }

  // GET /office/:id/insurances
  @Get(':id/insurances')
  async getInsurances(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.officeService.getInsurances(id);
  }

  // GET /office/:id
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.officeService.findOne(id);
  }

  // POST /office
  @Post()
  async create(@Body() dto: CreateOfficeDto) {
    return await this.officeService.create(dto);
  }

  // PATCH /office/:id
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateOfficeDto
  ) {
    return await this.officeService.update(id, dto);
  }

  // DELETE /office/:id
  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.officeService.remove(id);
  }
}
