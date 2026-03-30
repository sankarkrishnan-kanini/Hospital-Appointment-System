import { Module } from '@nestjs/common';
import { DoctorDocumentController } from './doctor-document.controller';
import { DoctorDocumentService } from './doctor-document.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DoctorDocumentController],
  providers: [DoctorDocumentService, PrismaService]
})
export class DoctorDocumentModule {}
