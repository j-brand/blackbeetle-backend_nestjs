import { Test, TestingModule } from '@nestjs/testing';
import { PublicPostsController } from './public-posts.controller';

describe('PublicPostsController', () => {
  let controller: PublicPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicPostsController],
    }).compile();

    controller = module.get<PublicPostsController>(PublicPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
