import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { CreateDoctorSpecializationDto } from './DTOS/createDoctorSpecializationDTO';
import { UpdateDoctorSpecializationDto } from './DTOS/updateDoctorSpecializationDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('doctor-specialization')
@UseGuards(AuthGuard)
export class DoctorSpecializationController {

  constructor(private readonly doctorSpecializationService: DoctorSpecializationService) {}

  // GET /doctor-specialization
  @Get()
  async findAll() {
    return await this.doctorSpecializationService.findAll();
  }

  // GET /doctor-specialization/doctor/:doctorId
  @Get('doctor/:doctorId')
  @Roles(Role.Doctor, Role.Admin)
  @UseGuards(RoleGuard)
  async findByDoctor(@Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number) {
    return await this.doctorSpecializationService.findByDoctor(doctorId);
  }

  // GET /doctor-specialization/specialization/:specializationId/doctors
  @Get('specialization/:specializationId/doctors')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  async findDoctorsBySpecialization(@Param('specializationId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) specializationId: number) {
    return await this.doctorSpecializationService.findDoctorsBySpecialization(specializationId);
  }

  // GET /doctor-specialization/:id
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorSpecializationService.findOne(id);
  }

  // POST /doctor-specialization
  @Post()
  @Roles(Role.Doctor)
  @UseGuards(RoleGuard)
  async create(@Body() dto: CreateDoctorSpecializationDto) {
    return await this.doctorSpecializationService.create(dto);
  }

  // PATCH /doctor-specialization/:id
  @Patch(':id')
  @Roles(Role.Doctor)
  @UseGuards(RoleGuard)
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateDoctorSpecializationDto) {
    return await this.doctorSpecializationService.update(id, dto);
  }

  // DELETE /doctor-specialization/doctor/:doctorId/specialization/:specializationId
  @Delete('doctor/:doctorId/specialization/:specializationId')
  async removeByDoctorAndSpecialization(
    @Param('doctorId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) doctorId: number,
    @Param('specializationId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) specializationId: number
  ) {
    return await this.doctorSpecializationService.removeByDoctorAndSpecialization(doctorId, specializationId);
  }

  // DELETE /doctor-specialization/:id
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.doctorSpecializationService.remove(id);
  }
}
