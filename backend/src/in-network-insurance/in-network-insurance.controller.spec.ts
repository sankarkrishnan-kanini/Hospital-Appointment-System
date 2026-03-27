import { Test, TestingModule } from '@nestjs/testing';
import { InNetworkInsuranceController } from './in-network-insurance.controller';

describe('InNetworkInsuranceController', () => {
  let controller: InNetworkInsuranceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InNetworkInsuranceController],
    }).compile();

    controller = module.get<InNetworkInsuranceController>(InNetworkInsuranceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
