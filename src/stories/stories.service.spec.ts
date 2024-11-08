import { Test, TestingModule } from '@nestjs/testing';
import { StoriesService } from './stories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Story } from '@entities/story.entity';
import { Repository } from 'typeorm';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { MediaService } from '@media/media.service';
import { CreateMediaDto } from '@app/media/dto/create-media.dto';
import { Media } from '@entities/media.entity';

describe('StoriesService', () => {
  let service: StoriesService;
  let repo: Repository<Story>;
  let mediaService: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoriesService,
        {
          provide: getRepositoryToken(Story),
          useClass: Repository,
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

    service = module.get<StoriesService>(StoriesService);
    repo = module.get<Repository<Story>>(getRepositoryToken(Story));
    mediaService = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a story', async () => {
      const createStoryDto: CreateStoryDto = {
        title: 'New Story',
        slug: 'new-story',
        description: 'Description',
        active: true,
        title_image: {} as Media,
        
      };
      const story = { id: 1, ...createStoryDto } as Story;

      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'create').mockReturnValue(story);
      jest.spyOn(repo, 'save').mockResolvedValue(story);

      expect(await service.create(createStoryDto)).toBe(story);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { slug: createStoryDto.slug } });
      expect(repo.create).toHaveBeenCalledWith(createStoryDto);
      expect(repo.save).toHaveBeenCalledWith(story);
    });

    it('should throw UnprocessableEntityException if story with slug already exists', async () => {
      const createStoryDto: CreateStoryDto = {
        title: 'New Story',
        slug: 'new-story',
        description: 'Description',
        active: true,
        title_image: {} as Media,
      };
      const story = { id: 1, ...createStoryDto } as Story;

      jest.spyOn(repo, 'findOne').mockResolvedValue(story);

      await expect(service.create(createStoryDto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('findAll', () => {
    it('should return an array of stories', async () => {
      const stories = [{ id: 1, title: 'Story 1' } as Story];
      jest.spyOn(repo, 'find').mockResolvedValue(stories);

      expect(await service.findAll()).toBe(stories);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a story', async () => {
      const story = { id: 1, title: 'Story 1' } as Story;
      jest.spyOn(repo, 'findOne').mockResolvedValue(story);

      expect(await service.findOne(1)).toBe(story);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['posts', 'title_image'],
      });
    });

    it('should throw NotFoundException if story is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a story', async () => {
      const updateStoryDto: UpdateStoryDto = { description: 'Updated Description' };
      const story = { id: 1, title: 'Story 1', description: 'Old Description' } as Story;
      const updatedStory = { ...story, ...updateStoryDto };

      jest.spyOn(repo, 'findOne').mockResolvedValue(story);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedStory);

      expect(await service.update(1, updateStoryDto)).toBe(updatedStory);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.save).toHaveBeenCalledWith(updatedStory);
    });

    it('should throw NotFoundException if story is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should update a story with a new description', async () => {
      const updateStoryDto: UpdateStoryDto = { description: 'Updated Description' };
      const story = { id: 1, title: 'Story 1', description: 'Old Description' } as Story;
      const updatedStory = { ...story, ...updateStoryDto };

      jest.spyOn(repo, 'findOne').mockResolvedValue(story);
      jest.spyOn(repo, 'save').mockResolvedValue(updatedStory);

      expect(await service.update(1, updateStoryDto)).toBe(updatedStory);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.save).toHaveBeenCalledWith(updatedStory);
    });
  });

  describe('remove', () => {
    it('should remove a story', async () => {
      const story = { id: 1, title: 'Story 1' } as Story;

      jest.spyOn(repo, 'findOne').mockResolvedValue(story);
      jest.spyOn(repo, 'remove').mockResolvedValue(story);

      expect(await service.remove(1)).toBe(story);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.remove).toHaveBeenCalledWith(story);
    });

    it('should throw NotFoundException if story is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
