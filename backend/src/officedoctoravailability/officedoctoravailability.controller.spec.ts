import { Test, TestingModule } from '@nestjs/testing';
import { OfficedoctoravailabilityController } from './officedoctoravailability.controller';

describe('OfficedoctoravailabilityController', () => {
  let controller: OfficedoctoravailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficedoctoravailabilityController],
    }).compile();

    controller = module.get<OfficedoctoravailabilityController>(OfficedoctoravailabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
