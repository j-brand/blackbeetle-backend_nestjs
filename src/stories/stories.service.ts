import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '@entities/story.entity';
import { CreateMediaDto } from '@app/media/dto/create-media.dto';
import { MediaService } from '@app/media/media.service';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story) private repo: Repository<Story>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createStoryDto: CreateStoryDto): Promise<Story> {
    const exists = await this.repo.findOne({
      where: { slug: createStoryDto.slug },
    });
    if (exists) {
      throw new UnprocessableEntityException(
        'Story with this slug already exists',
      );
    }

    const story = this.repo.create(createStoryDto);
    return this.repo.save(story);
  }

  async findAll(): Promise<Story[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Story> {
    const story = this.repo.findOne({
      where: { id },
      relations: ['posts', 'title_image'],
    });
    return story;
  }

  async update(
    id: number,
    updateStoryDto: Partial<UpdateStoryDto>,
    title_image?: Express.Multer.File,
  ): Promise<Story> {
    const story = await this.repo.findOne({
      where: { id },
    });
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    let oldImage = null;
    if (title_image) {
      oldImage = story.title_image;

      const newImage = await this.mediaService.create(
        {
          title: title_image.fieldname,
          path: `storage/stories/${id}`,
          type: 'IMAGE',
        } as CreateMediaDto,
        ['story_cover', 'og_image'],
      );
      updateStoryDto.title_image = newImage;
    }
    Object.assign(story, updateStoryDto);
    const result = this.repo.save(story);

    //remove old image
    if (oldImage) {
      await this.mediaService.remove(oldImage.id);
    }
    return result;
  }

  async remove(id: number): Promise<Story> {
    const story = await this.repo.findOne({
      where: { id },
    });
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    return this.repo.remove(story);
  }


}
