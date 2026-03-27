import { Test, TestingModule } from '@nestjs/testing';
import { DoctorDocumentController } from './doctor-document.controller';

describe('DoctorDocumentController', () => {
  let controller: DoctorDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorDocumentController],
    }).compile();

    controller = module.get<DoctorDocumentController>(DoctorDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
