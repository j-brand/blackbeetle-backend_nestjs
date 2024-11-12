import { PostType } from '@entities/post.entity';
import { User } from '@entities/user.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  author: User;
  
  @IsNotEmpty()
  story_id: number;

  @IsOptional()
  @IsNumber()
  order: number;

  type: PostType;

  @IsOptional()
  active: boolean;
}
