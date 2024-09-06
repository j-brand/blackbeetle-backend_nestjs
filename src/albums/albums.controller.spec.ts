import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsController } from '@albums/albums.controller';
import { AlbumsService } from '@albums/albums.service';

describe('AlbumsController', () => {
  let controller: AlbumsController;
  let fakeAlbumsService: Partial<AlbumsService>;

  beforeEach(async () => {
    fakeAlbumsService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [{ provide: AlbumsService, useValue: fakeAlbumsService }],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
