import { PostType } from '@entities/post.entity';
import { PostMedia } from '@entities/post_media.entity';
import { Expose, Type } from 'class-transformer';
import { PostMediaDto } from './post-media.dto';
import { CommentDto } from '@stories/comments/dto/comment.dto';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  story: number;

  @Expose()
  author: number;

  @Expose()
  type: PostType;

  @Expose()
  order: number;
  
  @Expose()
  active: boolean;

  @Expose()
  @Type(() => PostMediaDto)
  media: PostMedia[];

  @Expose()
  @Type(() => CommentDto)
  comments: Comment[];
}
