import { PostType } from '@entities/post.entity';
import { PostMedia } from '@entities/post_media.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { PostMediaDto } from './post-media.dto';
import { format } from 'date-fns';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class PublicPostDto {
  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsNumber()
  storyId: number;

  @Expose()
  @IsEnum(PostType)
  type: PostType;

  @Expose()
  @IsNumber()
  order: number;

  @Expose()
  @Type(() => PostMediaDto)
  media: PostMedia[];

  @Expose()
  @Transform(({ obj }) => format(obj.created_at, 'dd-MMM-yyyy'))
  created_at: Date;

  @Expose()
  @IsNumber()
  comments_count: number;
}
