import { PostType } from '@entities/post.entity';
import { PostMedia } from '@entities/post_media.entity';
import { Expose } from 'class-transformer';

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
  media: PostMedia[];
}
