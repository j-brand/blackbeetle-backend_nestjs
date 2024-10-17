import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseFilters,
  UploadedFile,
} from '@nestjs/common';
import { StoriesService } from '@stories/stories.service';
import { CreateStoryDto } from '@stories/dto/create-story.dto';
import { UpdateStoryDto } from '@stories/dto/update-story.dto';
import { diskStorageConf, imageFileFilter } from '@shared/upload/upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteFileOnFailFilter } from '@shared/filters/delete-file-on-fail/delete-file-on-fail.filter';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  create(@Body() createStoryDto: CreateStoryDto) {
    return this.storiesService.create(createStoryDto);
  }

  @Get()
  findAll() {
    return this.storiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storiesService.findOne(+id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storiesService.remove(+id);
  }
}
