import { Test, TestingModule } from '@nestjs/testing';
import { PublicAlbumsController } from './public-albums.controller';

describe('PublicAlbumsController', () => {
  let controller: PublicAlbumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicAlbumsController],
    }).compile();

    controller = module.get<PublicAlbumsController>(PublicAlbumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
