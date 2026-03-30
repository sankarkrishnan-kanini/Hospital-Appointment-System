import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';
import { UpdateDoctorDocumentDto } from './DTOS/updateDoctorDocumentDTO';

@Injectable()
export class DoctorDocumentService {

  constructor(private readonly prisma:PrismaService){}
  findAll() {
    return this.prisma.doctorDocument.findMany();
  }

  findOne(id: number) {
    return this.prisma.doctorDocument.findUnique({
      where: { id }
    });
  }

  create(data: CreateDoctorDocumentDto) {
    return this.prisma.doctorDocument.create({
      data: {
        doctorId: data.doctorId,
        documentType: data.documentType,
        fileUrl: Buffer.from(data.fileUrl),
      }
    });
  }

  update(id: number, data: UpdateDoctorDocumentDto) {
    return this.prisma.doctorDocument.update({
      where: { id },
      data: {
        ...(data.doctorId && { doctorId: data.doctorId }),
        ...(data.documentType && { documentType: data.documentType }),
        ...(data.fileUrl && { fileUrl: Buffer.from(data.fileUrl) }),
      }
    });
  }

  remove(id: number) {
    return this.prisma.doctorDocument.delete({
      where: { id }
    });
  }
}
