import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { PublicCommentDto } from './dto/public-comment.dto';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PageDto } from '@shared/pagination/page.dto';
import { CommentsService } from './comments.service';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';

@Controller('public/comments')
@Serialize(PublicCommentDto)
export class PublicCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('post/:id')
  @SetMetadata('paginate', true)
  async findByPost(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PublicCommentDto>> {
    return await this.commentsService.findByPost(+id, pageOptionsDto);
  }
}
