import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorDto } from './DTOS/createDoctorDTO';

import { UpdateDoctorDto } from './DTOS/updateDoctorDTO';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma:PrismaService){}
  findAll() {
    return this.prisma.doctor.findMany();
  }

  findOne(id: number) {
    return this.prisma.doctor.findUnique({
      where: { id }
    });
  }

  create(data: CreateDoctorDto) {
    return this.prisma.doctor.create({ data });
  }


  update(id: number, data: UpdateDoctorDto) {
    return this.prisma.doctor.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return this.prisma.doctor.delete({
      where: { id }
    });
  }
}
