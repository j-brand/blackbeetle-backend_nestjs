import { Test, TestingModule } from '@nestjs/testing';
import { PublicCommentsController } from './public-comments.controller';

describe('PublicCommentsController', () => {
  let controller: PublicCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicCommentsController],
    }).compile();

    controller = module.get<PublicCommentsController>(PublicCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
