import { Media } from '@app/database/entities/media.entity';
import { MediaDto } from '@app/media/dto/media.dto';
import { Expose, Type } from 'class-transformer';

export class AlbumMediaDto {
  @Expose()
  order: number;

  @Expose()
  @Type(() => MediaDto)
  media: Media;
}
