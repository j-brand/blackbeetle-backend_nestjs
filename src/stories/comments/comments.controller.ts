import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';
import { CommentDto } from './dto/comment.dto';
import { CommentPageDto } from './dto/comment-page.dto';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageDto } from '@shared/pagination/page.dto';

@Controller('comments')
@Serialize(CommentDto)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Get('post/:id')
  @SetMetadata('paginate', true)
  async findByPost(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CommentDto>> {
    return (await this.commentsService.findByPost(
      +id,
      pageOptionsDto,
    )) as PageDto<CommentDto>;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
