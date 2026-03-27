import { Test, TestingModule } from '@nestjs/testing';
import { HospitalAffiliationController } from './hospital-affiliation.controller';

describe('HospitalAffiliationController', () => {
  let controller: HospitalAffiliationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalAffiliationController],
    }).compile();

    controller = module.get<HospitalAffiliationController>(HospitalAffiliationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
