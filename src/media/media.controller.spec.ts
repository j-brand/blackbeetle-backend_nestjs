import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from '@media/media.controller';
import { MediaService } from '@media/media.service';

describe('MediaController', () => {
  let controller: MediaController;
  let fakeMediaService: Partial<MediaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [{ provide: MediaService, useValue: fakeMediaService }],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
