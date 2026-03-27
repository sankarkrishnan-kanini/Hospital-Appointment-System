import { Test, TestingModule } from '@nestjs/testing';
import { DoctorUnavailabilityController } from './doctor-unavailability.controller';

describe('DoctorUnavailabilityController', () => {
  let controller: DoctorUnavailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorUnavailabilityController],
    }).compile();

    controller = module.get<DoctorUnavailabilityController>(DoctorUnavailabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
