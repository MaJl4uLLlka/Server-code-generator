import { Test, TestingModule } from '@nestjs/testing';
import { EntityManagmentController } from './entity-managment.controller';
import { EntityManagmentService } from './entity-managment.service';

describe('EntityManagmentController', () => {
  let controller: EntityManagmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityManagmentController],
      providers: [EntityManagmentService],
    }).compile();

    controller = module.get<EntityManagmentController>(
      EntityManagmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
