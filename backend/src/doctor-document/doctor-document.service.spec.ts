import { Test, TestingModule } from '@nestjs/testing';
import { DoctorDocumentService } from './doctor-document.service';

describe('DoctorDocumentService', () => {
  let service: DoctorDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorDocumentService],
    }).compile();

    service = module.get<DoctorDocumentService>(DoctorDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
