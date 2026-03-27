import { Test, TestingModule } from '@nestjs/testing';
import { ClientAccountController } from './client-account.controller';

describe('ClientAccountController', () => {
  let controller: ClientAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAccountController],
    }).compile();

    controller = module.get<ClientAccountController>(ClientAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
