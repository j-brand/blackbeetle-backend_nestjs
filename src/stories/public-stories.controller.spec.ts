import { Test, TestingModule } from '@nestjs/testing';
import { PublicStoriesController } from './public-stories.controller';

describe('PublicStoriesController', () => {
  let controller: PublicStoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicStoriesController],
    }).compile();

    controller = module.get<PublicStoriesController>(PublicStoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
