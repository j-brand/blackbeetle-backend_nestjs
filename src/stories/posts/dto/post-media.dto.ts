import { Media } from '@database/entities/media.entity';
import { MediaDto } from '@media/dto/media.dto';
import { Expose, Type } from 'class-transformer';

export class PostMediaDto {
  @Expose()
  order: number;

  @Expose()
  @Type(() => MediaDto)
  media: Media;
}
