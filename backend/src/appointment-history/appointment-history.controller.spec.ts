import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentHistoryController } from './appointment-history.controller';

describe('AppointmentHistoryController', () => {
  let controller: AppointmentHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentHistoryController],
    }).compile();

    controller = module.get<AppointmentHistoryController>(AppointmentHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
