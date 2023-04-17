import { Test, TestingModule } from '@nestjs/testing';
import { EntityManagmentService } from './entity-managment.service';

describe('EntityManagmentService', () => {
  let service: EntityManagmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityManagmentService],
    }).compile();

    service = module.get<EntityManagmentService>(EntityManagmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
