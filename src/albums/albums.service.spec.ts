import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsService } from '@albums/albums.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Album } from '@entities/album.entity';
import { MediaService } from '@media/media.service';
import { AlbumMedia } from '@entities/album_media.entity';
import { Repository } from 'typeorm';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { UpdateAlbumDto } from '@albums/dto/update-album.dto';
import { Media } from '@entities/media.entity';

const mockAlbum = {
  id: 1,
  title: 'Test Album',
  slug: 'test-album',
  media: [],
} as Album;

const mockMedia = {
  id: 1,
  title: 'Test Media',
  path: 'path/to/media',
} as Media;

describe('AlbumsService', () => {
  let service: AlbumsService;
  let albumRepo: Repository<Album>;
  let albumMediaRepo: Repository<AlbumMedia>;
  let mediaService: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: getRepositoryToken(Album),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AlbumMedia),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MediaService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    albumRepo = module.get<Repository<Album>>(getRepositoryToken(Album));
    albumMediaRepo = module.get<Repository<AlbumMedia>>(getRepositoryToken(AlbumMedia));
    mediaService = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new album', async () => {
      const createAlbumDto: CreateAlbumDto = {
        title: 'Test Album',
        slug: 'test-album',
      } as Album;

      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(albumRepo, 'create').mockReturnValue(mockAlbum);
      jest.spyOn(albumRepo, 'save').mockResolvedValue(mockAlbum);

      const result = await service.create(createAlbumDto);
      expect(result).toEqual(mockAlbum);
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { slug: createAlbumDto.slug } });
      expect(albumRepo.create).toHaveBeenCalledWith(createAlbumDto);
      expect(albumRepo.save).toHaveBeenCalledWith(mockAlbum);
    });

    it('should throw UnprocessableEntityException if album with slug already exists', async () => {
      const createAlbumDto: CreateAlbumDto = {
        title: 'Test Album',
        slug: 'test-album',
      } as Album;

      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(mockAlbum);

      await expect(service.create(createAlbumDto)).rejects.toThrow(UnprocessableEntityException);
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { slug: createAlbumDto.slug } });
    });
  });

  describe('findAll', () => {
    it('should return all albums', async () => {
      jest.spyOn(albumRepo, 'find').mockResolvedValue([mockAlbum]);

      const result = await service.findAll();
      expect(result).toEqual([mockAlbum]);
      expect(albumRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an album by id', async () => {
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(mockAlbum);

      const result = await service.findOne(1);
      expect(result).toEqual(mockAlbum);
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['media', 'title_image'] });
    });

    it('should throw NotFoundException if album not found', async () => {
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an album', async () => {
      const updateAlbumDto: UpdateAlbumDto = {
        title: 'Updated Album',
      };

      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(mockAlbum);
      jest.spyOn(albumRepo, 'save').mockResolvedValue({ ...mockAlbum, ...updateAlbumDto });

      const result = await service.update(1, updateAlbumDto);
      expect(result).toEqual({ ...mockAlbum, ...updateAlbumDto });
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(albumRepo.save).toHaveBeenCalledWith({ ...mockAlbum, ...updateAlbumDto });
    });

    it('should throw NotFoundException if album not found', async () => {
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an album', async () => {

      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(mockAlbum);
      jest.spyOn(albumRepo, 'remove').mockResolvedValue(mockAlbum);

      const result = await service.remove(1);
      expect(result).toEqual(mockAlbum);
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['media'] });
      expect(albumRepo.remove).toHaveBeenCalledWith(mockAlbum);
    });

    it('should throw NotFoundException if album not found', async () => {
      jest.spyOn(albumRepo, 'remove').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addImage', () => {
    it('should add an image to an album', async () => {
      const image = { filename: 'test.jpg' } as Express.Multer.File;

      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(mockAlbum);
      jest.spyOn(mediaService, 'create').mockResolvedValue(mockMedia);
      jest.spyOn(albumRepo, 'save').mockResolvedValue(mockAlbum);


      const result = await service.addImage(1, image);
      expect(result).toEqual(mockAlbum);
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['media'] });
      expect(mediaService.create).toHaveBeenCalled();
      expect(albumRepo.save).toHaveBeenCalledWith(mockAlbum);
    });

    it('should throw NotFoundException if album not found', async () => {
 
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(null);

      await expect(service.addImage(1, {} as Express.Multer.File)).rejects.toThrow(NotFoundException);
    });
  });
/* 
  describe('removeImage', () => {
    it('should remove an image from an album', async () => {
      const albumWithMedia = { ...mockAlbum, media: [{ media: mockMedia }] } as Album;
      //albumRepo.findOne.mockResolvedValue(albumWithMedia);
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(albumWithMedia);

      const result = await service.removeImage(1, 1);
      expect(result).toEqual(mockAlbum);
      expect(albumRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['media'] });
      expect(mediaService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if album not found', async () => {
 
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(null);

      await expect(service.removeImage(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if image not found in album', async () => {
      jest.spyOn(albumRepo, 'findOne').mockResolvedValue(mockAlbum);

      await expect(service.removeImage(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateImageOrder', () => {
    it('should update the order of images in an album', async () => {
      const albumMedia1 = { id: 1, order: 1 } as AlbumMedia;
      const albumMedia2 = { id: 2, order: 2 } as AlbumMedia;

      jest.spyOn(albumMediaRepo, 'findOne').mockResolvedValueOnce(albumMedia1);
      jest.spyOn(albumMediaRepo, 'findOne').mockResolvedValueOnce(albumMedia2);

      await service.updateImageOrder(1, 1, 2);

      expect(albumMediaRepo.findOne).toHaveBeenCalledWith({ where: { album: { id: 1 }, media: { id: 1 } } });
      expect(albumMediaRepo.findOne).toHaveBeenCalledWith({ where: { album: { id: 1 }, media: { id: 2 } } });
      expect(albumMediaRepo.save).toHaveBeenCalledWith([albumMedia1, albumMedia2]);
    });

    it('should throw NotFoundException if first image not found in album', async () => {

      jest.spyOn(albumMediaRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateImageOrder(1, 1, 2)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if second image not found in album', async () => {
      const albumMedia1 = { id: 1, order: 1 } as AlbumMedia;

      jest.spyOn(albumMediaRepo, 'findOne').mockResolvedValueOnce(albumMedia1);
      jest.spyOn(albumMediaRepo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.updateImageOrder(1, 1, 2)).rejects.toThrow(NotFoundException);
    }); 
  });
  */
});
