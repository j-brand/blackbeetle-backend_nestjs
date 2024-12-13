import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Media } from '@entities/media.entity';
import { MediaVariation } from '@entities/media_variation.entity';
import { Repository } from 'typeorm';
import { ImageService } from './image.service';
import { NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from '@media/dto/create-media.dto';
import { UpdateMediaDto } from '@media/dto/update-media.dto';
import * as fs from 'fs';
import * as path from 'path';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
 
jest.mock('fs');
jest.mock('path');
jest.mock('app-root-path', () => ({
  path: __dirname,
}));

describe('MediaService', () => {
  let service: MediaService;
  let repo: Repository<Media>;
  let variationRepo: Repository<MediaVariation>;
  let imageService: ImageService;
  let imageQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        ImageService,
        {
          provide: getRepositoryToken(Media),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MediaVariation),
          useClass: Repository,
        },
        {
          provide: getQueueToken('image'),
          useValue: {
            add: jest.fn(), // Mock the add method to do nothing
          },
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    repo = module.get<Repository<Media>>(getRepositoryToken(Media));
    variationRepo = module.get<Repository<MediaVariation>>(
      getRepositoryToken(MediaVariation),
    );
    imageService = module.get<ImageService>(ImageService);
    imageQueue = module.get<Queue>(getQueueToken('image'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new media', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'test',
        path: 'test/path',
        upload_path: 'upload/path',
        type: 'image',
      } as CreateMediaDto;
      const media = { ...createMediaDto, id: 1 };
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => 'mocked/path');
      jest.spyOn(fs, 'copyFileSync').mockImplementation(() => {});
      jest.spyOn(repo, 'save').mockResolvedValue(media as unknown as Media);

      const result = await service.create(createMediaDto);

      expect(result).toEqual(media);
      expect(fs.existsSync).toHaveBeenCalledWith(path.join(createMediaDto.upload_path, createMediaDto.title));
      expect(fs.mkdirSync).toHaveBeenCalledWith(createMediaDto.path, { recursive: true });
      expect(fs.copyFileSync).toHaveBeenCalledWith(path.join(createMediaDto.upload_path, createMediaDto.title), path.join(createMediaDto.path, createMediaDto.title));
      expect(repo.save).toHaveBeenCalledWith(createMediaDto);
    });

    it('should throw an error if file does not exist', async () => {
      const createMediaDto: CreateMediaDto = {
        title: 'test',
        path: 'test/path',
        upload_path: 'upload/path',
        type: 'image',
      } as CreateMediaDto;
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await expect(service.create(createMediaDto)).rejects.toThrowError(`File at path ${path.join(createMediaDto.upload_path, createMediaDto.title)} does not exist`);
    });
  });

  describe('findOne', () => {
    it('should return a media', async () => {
      const media = { id: 1, title: 'test' } as Media;
      jest.spyOn(repo, 'findOne').mockResolvedValue(media);

      const result = await service.findOne(1);

      expect(result).toEqual(media);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['variations'] });
    });

    it('should throw NotFoundException if media not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a media', async () => {
      const updateMediaDto: Partial<UpdateMediaDto> = { title: 'updated' };
      const media = { id: 1, title: 'test' } as Media;
      jest.spyOn(repo, 'findOne').mockResolvedValue(media);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...media, ...updateMediaDto });

      const result = await service.update(1, updateMediaDto);

      expect(result).toEqual({ ...media, ...updateMediaDto });
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.save).toHaveBeenCalledWith({ ...media, ...updateMediaDto });
    });

    it('should throw NotFoundException if media not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a media', async () => {
      const media = { id: 1, title: 'test' } as Media;
      jest.spyOn(repo, 'findOne').mockResolvedValue(media);
      jest.spyOn(repo, 'remove').mockResolvedValue(media);

      const result = await service.remove(1);

      expect(result).toEqual(media);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.remove).toHaveBeenCalledWith(media);
    });

    it('should throw NotFoundException if media not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrowError(NotFoundException);
    });
  });
});