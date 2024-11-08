import { Test, TestingModule } from '@nestjs/testing';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from '@entities/story.entity';
import { NotFoundException } from '@nestjs/common';

describe('StoriesController', () => {
  let controller: StoriesController;
  let service: StoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoriesController],
      providers: [
        {
          provide: StoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StoriesController>(StoriesController);
    service = module.get<StoriesService>(StoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a story', async () => {
      const createStoryDto = {
        title: 'New Story',
        slug: 'new-story',
        description: 'Description',
        active: true,
      } as Story;
      const result = { id: 1, ...createStoryDto } as Story;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createStoryDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createStoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of stories', async () => {
      const result = [{ id: 1, title: 'Story 1' } as Story];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a story', async () => {
      const result = { id: 1, title: 'Story 1' } as Story;
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a story', async () => {
      const updateStoryDto: UpdateStoryDto = { title: 'Updated Story' };
      const result = { id: 1, ...updateStoryDto } as Story;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateStoryDto, null)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updateStoryDto, null);
    });
  });

  describe('remove', () => {
    it('should remove a story', async () => {
      const result = { id: 1, title: 'Story 1' } as Story;
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
