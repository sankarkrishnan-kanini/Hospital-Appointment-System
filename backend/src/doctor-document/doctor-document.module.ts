import { Module } from '@nestjs/common';
import { DoctorDocumentController } from './doctor-document.controller';
import { DoctorDocumentService } from './doctor-document.service';

@Module({
  controllers: [DoctorDocumentController],
  providers: [DoctorDocumentService]
})
export class DoctorDocumentModule {}
