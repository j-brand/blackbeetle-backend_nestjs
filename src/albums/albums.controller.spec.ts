import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from '@albums/albums.service';
import { MediaService } from '@media/media.service';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { UpdateAlbumDto } from '@albums/dto/update-album.dto';
import { NotFoundException } from '@nestjs/common';
import { Album } from '@entities/album.entity';

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
            addImage: jest.fn(),
            removeImage: jest.fn(),
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
      const createAlbumDto = {
        title: 'New Album',
        slug: 'new-album',
        description: 'Description',
        start_date: new Date(),
        end_date: new Date(),
        title_image: undefined,
      };
      const result = { id: 1, ...createAlbumDto } as Album;

      jest.spyOn(albumsService, 'create').mockResolvedValue(result);

      expect(await controller.create(createAlbumDto)).toBe(result);
      expect(albumsService.create).toHaveBeenCalledWith(createAlbumDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of albums', async () => {
      const result = [{ id: 1, title: 'Album 1' } as Album];
      jest.spyOn(albumsService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(albumsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an album', async () => {
      const result = { id: 1, title: 'Album 1' } as Album;
      jest.spyOn(albumsService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(albumsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an album', async () => {
      const updateAlbumDto: UpdateAlbumDto = { title: 'Updated Album' };
      const result = { id: 1, ...updateAlbumDto } as Album;

      jest.spyOn(albumsService, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateAlbumDto, null)).toBe(result);
      expect(albumsService.update).toHaveBeenCalledWith(1, updateAlbumDto, null);
    });
  });

  describe('remove', () => {
    it('should remove an album', async () => {
      const result = { id: 1, title: 'Album 1' } as Album;
      jest.spyOn(albumsService, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(albumsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('addImages', () => {
    it('should add images', async () => {
      const files = [{ originalname: 'test.jpg', buffer: Buffer.from('') } as Express.Multer.File];
      jest.spyOn(albumsService, 'addImage').mockResolvedValue(undefined);

      await controller.addImages(files, '1');

      expect(albumsService.addImage).toHaveBeenCalledWith(1, files[0]);
    });
  });

  describe('removeImage', () => {
    it('should remove an image', async () => {
      jest.spyOn(albumsService, 'removeImage').mockResolvedValue(undefined);

      await controller.removeImage('1', '1');

      expect(albumsService.removeImage).toHaveBeenCalledWith(1, 1);
    });
  });
});