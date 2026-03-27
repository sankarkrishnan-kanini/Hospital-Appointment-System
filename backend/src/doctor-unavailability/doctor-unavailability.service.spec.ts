import { Test, TestingModule } from '@nestjs/testing';
import { DoctorUnavailabilityService } from './doctor-unavailability.service';

describe('DoctorUnavailabilityService', () => {
  let service: DoctorUnavailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorUnavailabilityService],
    }).compile();

    service = module.get<DoctorUnavailabilityService>(DoctorUnavailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
