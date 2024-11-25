import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  SetMetadata,
  Delete,
} from '@nestjs/common';
import { StoriesService } from '@stories/stories.service';
import { CreateStoryDto } from '@stories/dto/create-story.dto';
import { UpdateStoryDto } from '@stories/dto/update-story.dto';
import { diskStorageConf, imageFileFilter } from '@shared/upload/upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteFileOnFailFilter } from '@shared/filters/delete-file-on-fail/delete-file-on-fail.filter';
import { StoryDto } from './dto/story.dto';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageDto } from '@shared/pagination/page.dto';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';

@Controller('stories')
@Serialize(StoryDto)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  /**
   * Handles POST requests to create a new story.
   * The request body should contain the data for the new story.
   * 
   * @param createStoryDto - The data transfer object containing the story details.
   * @returns The created story data.
   */
  @Post()
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(createStoryDto);
  }

  /**
   * Handles GET requests to retrieve all stories with pagination.
   * The response is serialized to the StoryDto format and paginated.
   * 
   * @param pageOptionsDto - The pagination options.
   * @returns A paginated list of stories serialized to StoryDto.
   */
  @Get()
  @SetMetadata('paginate', true)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StoryDto>> {
    return (await this.storiesService.findAll(
      pageOptionsDto,
    )) as PageDto<StoryDto>;
  }

  /**
   * Handles GET requests to retrieve a single story by its ID.
   * The response is serialized to the StoryDto format.
   * 
   * @param id - The ID of the story to retrieve.
   * @returns The story data serialized to StoryDto.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storiesService.findOne(+id);
  }

  /**
   * Handles PATCH requests to update an existing story by its ID.
   * The request body should contain the updated data for the story.
   * The request can also include an uploaded file for the title image.
   * 
   * @param id - The ID of the story to update.
   * @param data - The data transfer object containing the updated story details.
   * @param title_image - The uploaded file for the title image.
   * @returns The updated story data.
   */
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('title_image', {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  @UseFilters(DeleteFileOnFailFilter)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStoryDto,
    @UploadedFile() title_image: Express.Multer.File,
  ) {
    const response = await this.storiesService.update(
      +id,
      data,
      title_image ? title_image : null,
    );
    return response;
  }

  /**
   * Handles DELETE requests to remove an existing story by its ID.
   * 
   * @param id - The ID of the story to remove.
   * @returns A confirmation message or the result of the deletion operation.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storiesService.remove(+id);
  }
}
