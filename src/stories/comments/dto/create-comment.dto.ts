import { Post } from '@entities/post.entity';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  post_id: number;
}
