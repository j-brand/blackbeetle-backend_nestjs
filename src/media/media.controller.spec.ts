import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from '@media/media.service';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';
import { Media } from '@app/database/entities/media.entity';

jest.mock('fs');

describe('MediaController', () => {
  let mediaController: MediaController;
  let mediaService: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    mediaController = module.get<MediaController>(MediaController);
    mediaService = module.get<MediaService>(MediaService);
  });

  describe('findOne', () => {
    it('should return a media item', async () => {
      const result = { id: 1, path: 'path/to/media' };
      jest.spyOn(mediaService, 'findOne').mockResolvedValue(result as Media);

      expect(await mediaController.findOne('1')).toBe(result);
      expect(mediaService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a media item and its variations', async () => {
      const media = {
        id: 1,
        path: 'path/to/media',
        variations: [{ path: 'path/to/variation1' }, { path: 'path/to/variation2' }],
      };
      jest.spyOn(mediaService, 'remove').mockResolvedValue(media as Media);

      await mediaController.remove('1');

      expect(mediaService.remove).toHaveBeenCalledWith(1);
      expect(fs.unlinkSync).toHaveBeenCalledWith('path/to/media');
      expect(fs.unlinkSync).toHaveBeenCalledWith('path/to/variation1');
      expect(fs.unlinkSync).toHaveBeenCalledWith('path/to/variation2');
    });

    it('should throw NotFoundException if media item is not found', async () => {
      jest.spyOn(mediaService, 'remove').mockResolvedValue(null);

      await expect(mediaController.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
