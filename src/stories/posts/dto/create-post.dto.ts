import { Post, PostType } from '@entities/post.entity';
import { Story } from '@entities/story.entity';
import { User } from '@entities/user.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  author: User;

  story: Story;

  @IsNumber()
  order: number;

  type: PostType;

  @IsOptional()
  active: boolean;
}
