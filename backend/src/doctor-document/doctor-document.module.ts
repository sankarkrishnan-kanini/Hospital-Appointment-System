import { Module } from '@nestjs/common';
import { DoctorDocumentController } from './doctor-document.controller';
import { DoctorDocumentService } from './doctor-document.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorDocumentController],
  providers: [DoctorDocumentService]
})
export class DoctorDocumentModule {}
