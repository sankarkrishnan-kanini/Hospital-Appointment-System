import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './DTOS/createDoctorDTO';
import { UpdateDoctorDto } from './DTOS/updateDoctorDTO';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('doctors')
export class DoctorController {

  constructor(private readonly doctorService: DoctorService) {}

  // ─── BUSINESS LOGIC ENDPOINTS ────────────────────────────────────────────────

  // GET /doctors — all verified doctors with flattened specializations and offices
  @Get()
  getVerifiedDoctors() {
    return this.doctorService.getVerifiedDoctors();
  }

  // ─── ADMIN ONLY ENDPOINTS (restrict when auth is added) ──────────────────────

  // GET /doctors/all — static route must come before /:id
  @Get('all')
  findAll() {
    return this.doctorService.findAll();
  }

  // GET /doctors/:id — full doctor profile
  @Get(':id')
  getDoctorProfile(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorService.getDoctorProfile(id);
  }

  // POST /doctors
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateDoctorDto, @Request() req) {
    return this.doctorService.create(dto, req.user.sub);
  }

  // PATCH /doctors/:id/verify — admin only
  @Patch(':id/verify')
  verifyDoctor(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.doctorService.verifyDoctor(id);
  }

  // PATCH /doctors/:id
  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateDoctorDto
  ) {
    return this.doctorService.update(id, dto);
  }

  // DELETE /doctors/:id
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.doctorService.remove(id);
  }
}
