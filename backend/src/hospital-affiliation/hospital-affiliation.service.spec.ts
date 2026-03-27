import { Test, TestingModule } from '@nestjs/testing';
import { HospitalAffiliationService } from './hospital-affiliation.service';

describe('HospitalAffiliationService', () => {
  let service: HospitalAffiliationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalAffiliationService],
    }).compile();

    service = module.get<HospitalAffiliationService>(HospitalAffiliationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
