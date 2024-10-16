import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from '@albums/albums.service';
import { MediaService } from '@media/media.service';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { UpdateAlbumDto } from '@albums/dto/update-album.dto';
import { NotFoundException } from '@nestjs/common';

describe('AlbumsController', () => {
  let controller: AlbumsController;
  let albumsService: AlbumsService;
  let mediaService: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [
        {
          provide: AlbumsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: MediaService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
    albumsService = module.get<AlbumsService>(AlbumsService);
    mediaService = module.get<MediaService>(MediaService);
  });

  describe('create', () => {
    it('should create an album', async () => {
      const createAlbumDto: CreateAlbumDto = { title: 'New Album' };
      const result = { id: 1, ...createAlbumDto };

      jest.spyOn(albumsService, 'create').mockResolvedValue(result);

      expect(await controller.create(createAlbumDto)).toBe(result);
      expect(albumsService.create).toHaveBeenCalledWith(createAlbumDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of albums', async () => {
      const result = [{ id: 1, title: 'Album 1' }];
      jest.spyOn(albumsService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(albumsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an album', async () => {
      const result = { id: 1, title: 'Album 1' };
      jest.spyOn(albumsService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(albumsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if album is not found', async () => {
      jest.spyOn(albumsService, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an album', async () => {
      const updateAlbumDto: UpdateAlbumDto = { title: 'Updated Album' };
      const result = { id: 1, ...updateAlbumDto };

      jest.spyOn(albumsService, 'update').mockResolvedValue(result );

      expect(await controller.update('1', updateAlbumDto)).toBe(result);
      expect(albumsService.update).toHaveBeenCalledWith(1, updateAlbumDto);
    });
  });

  describe('remove', () => {
    it('should remove an album', async () => {
      const result = { id: 1, title: 'Album 1' };
      jest.spyOn(albumsService, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(albumsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('addImages', () => {
    it('should add images ', async () => {
      const file = { originalname: 'test.jpg', buffer: Buffer.from('') };
      const result = { url: 'http://example.com/test.jpg' };

      jest.spyOn(mediaService, 'uploadFile').mockResolvedValue(result);

      expect(await controller.uploadFile(file)).toBe(result);
      expect(mediaService.uploadFile).toHaveBeenCalledWith(file);
    });
  });
});
