import { AlbumMedia } from '@app/database/entities/album_media.entity';
import { Media } from '@app/database/entities/media.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { AlbumMediaDto } from './album-media.dto';
import { MediaDto } from '@media/dto/media.dto';

export class AlbumDto {

  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  @Type(() => MediaDto)
  title_image: Media;

  @Expose()
  @Type(() => AlbumMediaDto)
  media: AlbumMedia[];
}
