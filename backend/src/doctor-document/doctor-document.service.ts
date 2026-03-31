import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';
import { UpdateDoctorDocumentDto } from './DTOS/updateDoctorDocumentDTO';

@Injectable()
export class DoctorDocumentService {

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doctorDocument.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.doctorDocument.findUnique({ where: { id } });
  }

  async create(data: CreateDoctorDocumentDto) {
    return await this.prisma.doctorDocument.create({
      data: {
        doctorId: data.doctorId,
        documentType: data.documentType,
        fileUrl: Buffer.from(data.fileUrl),
      }
    });
  }

  async update(id: number, data: UpdateDoctorDocumentDto) {
    return await this.prisma.doctorDocument.update({
      where: { id },
      data: {
        ...(data.doctorId && { doctorId: data.doctorId }),
        ...(data.documentType && { documentType: data.documentType }),
        ...(data.fileUrl && { fileUrl: Buffer.from(data.fileUrl) }),
      }
    });
  }

  async remove(id: number) {
    return await this.prisma.doctorDocument.delete({ where: { id } });
  }
}
