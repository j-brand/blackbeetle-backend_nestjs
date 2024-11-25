import { Controller, Get, Param, Query, SetMetadata } from '@nestjs/common';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';
import { PublicPostDto } from './dto/public-post.dto';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PostsService } from './posts.service';
import { PageDto } from '@shared/pagination/page.dto';

@Controller('public/posts')
@Serialize(PublicPostDto)
export class PublicPostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Handles GET requests to retrieve paginated posts by story ID.
   * The response is serialized to the PublicPostDto format and paginated.
   * 
   * @param storyId - The ID of the story to retrieve posts for.
   * @param pageOptionsDto - The pagination options.
   * @returns A paginated list of posts serialized to PublicPostDto.
   */
  @Get(':id')
  @SetMetadata('paginate', true)
  async getPostsByStoryId(
    @Param('id') storyId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PublicPostDto>> {
    return await this.postsService.findByStory(+storyId, pageOptionsDto, true);
  }
}
