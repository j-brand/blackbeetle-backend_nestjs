import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.repo.create(createCommentDto);
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

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
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
