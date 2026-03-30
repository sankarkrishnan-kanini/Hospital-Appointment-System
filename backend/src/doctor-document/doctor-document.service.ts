import { Injectable } from '@nestjs/common';
import { prisma } from '../adaptor';
import { CreateDoctorDocumentDto } from './DTOS/createDoctorDocumentDTO';
import { UpdateDoctorDocumentDto } from './DTOS/updateDoctorDocumentDTO';

@Injectable()
export class DoctorDocumentService {

  findAll() {
    return prisma.doctorDocument.findMany();
  }

  findOne(id: number) {
    return prisma.doctorDocument.findUnique({
      where: { id }
    });
  }

  create(data: CreateDoctorDocumentDto) {
    return prisma.doctorDocument.create({
      data: {
        doctorId: data.doctorId,
        documentType: data.documentType,
        fileUrl: Buffer.from(data.fileUrl),
      }
    });
  }

  update(id: number, data: UpdateDoctorDocumentDto) {
    return prisma.doctorDocument.update({
      where: { id },
      data: {
        ...(data.doctorId && { doctorId: data.doctorId }),
        ...(data.documentType && { documentType: data.documentType }),
        ...(data.fileUrl && { fileUrl: Buffer.from(data.fileUrl) }),
      }
    });
  }

  remove(id: number) {
    return prisma.doctorDocument.delete({
      where: { id }
    });
  }
}
