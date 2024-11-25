import { Controller, Get, Param, Query, SetMetadata } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageDto } from '@shared/pagination/page.dto';
import { PublicStoryDto } from './dto/public-story.dto';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';

@Controller('public/stories')
@Serialize(PublicStoryDto)
export class PublicStoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.storiesService.findOneBySlug(slug, true);
  }

  @Get()
  @SetMetadata('paginate', true)
  async findActive(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PublicStoryDto>> {
    return await this.storiesService.findAll(pageOptionsDto, true);
  }
}
