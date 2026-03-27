import { Test, TestingModule } from '@nestjs/testing';
import { InNetworkInsuranceService } from './in-network-insurance.service';

describe('InNetworkInsuranceService', () => {
  let service: InNetworkInsuranceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InNetworkInsuranceService],
    }).compile();

    service = module.get<InNetworkInsuranceService>(InNetworkInsuranceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
