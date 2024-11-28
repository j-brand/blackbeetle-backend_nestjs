import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorageConf, imageFileFilter } from '@shared/upload/upload.utils';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';
import { PostDto } from './dto/post.dto';
import { AuthGuard } from '@auth/guards/auth.guard';
import { PostMedia } from '@entities/post_media.entity';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PublicPostDto } from './dto/public-post.dto';
import { PageDto } from '@shared/pagination/page.dto';

export class test {
  query?: string = 'default';
}

@Controller('posts')
@Serialize(PostDto)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @SetMetadata('paginate', true)
  async getPosts(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.postsService.findAll(pageOptionsDto);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    createPostDto.author = req.user;
    return this.postsService.create(createPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get('story/:storyId')
  @SetMetadata('paginate', true)
  findByStory(
    @Param('storyId') storyId: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PostDto | PublicPostDto>> {
    return this.postsService.findByStory(+storyId, pageOptionsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  async addImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    let images: PostMedia[] = [];
    for (const file of files) {
      images = await this.postsService.addImage(+id, file);
    }

    return images;
  }
}
