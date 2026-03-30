import { Test, TestingModule } from '@nestjs/testing';
import { OfficedoctoravailabilityService } from './officedoctoravailability.service';

describe('OfficedoctoravailabilityService', () => {
  let service: OfficedoctoravailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficedoctoravailabilityService],
    }).compile();

    service = module.get<OfficedoctoravailabilityService>(OfficedoctoravailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
