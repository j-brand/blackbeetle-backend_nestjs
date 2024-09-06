import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { ImageService } from '@media/image.service';
import { MediaService } from '@media/media.service';

describe('UploadController', () => {
  let controller: UploadController;
  let fakeImagesService: Partial<ImageService>;
  let fakeMediaService: Partial<MediaService>;

  beforeEach(async () => {
    fakeImagesService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        { provide: ImageService, useValue: fakeImagesService },
        { provide: MediaService, useValue: fakeMediaService },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
