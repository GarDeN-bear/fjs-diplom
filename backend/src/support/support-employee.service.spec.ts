import { Test, TestingModule } from '@nestjs/testing';
import { SupportEmployeeService } from './support-employee.service';

describe('SupportEmployeeService', () => {
  let service: SupportEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportEmployeeService],
    }).compile();

    service = module.get<SupportEmployeeService>(SupportEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
