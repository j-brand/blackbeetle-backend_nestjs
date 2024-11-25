import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@entities/comment.entity';
import { CommentPageDto } from './dto/comment-page.dto';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageMetaDtoFactory } from '@shared/pagination/page-meta.dto';
import { PageDto } from '@shared/pagination/page.dto';
import { CommentDto } from './dto/comment.dto';
import { PublicCommentDto } from './dto/public-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.repo.create({
      ...createCommentDto,
      post: { id: createCommentDto.post_id },
    });

    return this.repo.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.repo.findOne({ where: { id } });
    this.ensureCommentExists(comment, id);
    return comment;
  }

  async findByPost(
    postId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CommentDto | PublicCommentDto>> {
    const [comments, itemCount] = await this.repo.findAndCount({
      where: { post: { id: postId } },
      order: { created_at: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    });

    const pageMetaDto = PageMetaDtoFactory.create({
      pageOptionsDto,
      itemCount,
    });

    return new PageDto(comments, pageMetaDto);
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    await this.repo.update(id, updateCommentDto);
    const updatedComment = await this.repo.findOne({ where: { id } });
    this.ensureCommentExists(updatedComment, id);
    return updatedComment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }

  private ensureCommentExists(comment: Comment, id: number): void {
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }
}
