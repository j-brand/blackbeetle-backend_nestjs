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
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageMetaDtoFactory } from '@shared/pagination/page-meta.dto';
import { PageDto } from '@shared/pagination/page.dto';
import { StoryDto } from './dto/story.dto';
import { PublicStoryDto } from './dto/public-story.dto';

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

  /**
   * Retrieves a paginated list of stories based on the provided page options.
   *
   * @param pageOptionsDto - The pagination and sorting options.
   * @returns A promise that resolves to a PageStoryDto containing the stories and pagination metadata.
   */
  async findAll(
    pageOptionsDto: PageOptionsDto,
    active_only: boolean = false,
  ): Promise<PageDto<StoryDto | PublicStoryDto>> {
    const [items, itemCount] = await this.repo.findAndCount({
      where: active_only ? { active: true } : {},
      order: { created_at: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: ['title_image', 'posts'],
    });

    const pageMetaDto = PageMetaDtoFactory.create({
      pageOptionsDto,
      itemCount,
    });

    return new PageDto(items, pageMetaDto);
  }

  async findOne(id: number): Promise<Story> {
    const story = await this.repo.findOne({
      where: { id },
      relations: ['posts', 'title_image'],
    });

    this.ensureStoryExists(story, id);

    return story;
  }

  async findOneBySlug(
    slug: string,
    active_only: boolean = false,
  ): Promise<Story> {
    const story = await this.repo.findOne({
      where: { slug },
      relations: ['title_image'],
    });

    this.ensureStoryExists(story, slug);

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

    this.ensureStoryExists(story, id);

    let oldImage = null;
    if (title_image) {
      oldImage = story.title_image;

      const newImage = await this.mediaService.create(
        {
          title: title_image.filename,
          path: `storage/stories/${id}`,
          upload_path: `storage/upload/tmp`,
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
    this.ensureStoryExists(story, id);

    return this.repo.remove(story);
  }

  private ensureStoryExists(story: Story, id: number | string): void {
    let entity = 'ID';
    if (typeof id === 'string') {
      entity = 'Slug';
    }

    if (!story) {
      throw new NotFoundException(`Story with ${entity} ${id} not found`);
    }
  }
}
