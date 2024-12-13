import { Media } from '@entities/media.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { AlbumMediaDto } from './album-media.dto';
import { AlbumMedia } from '@entities/album_media.entity';
import { format } from 'date-fns';
import { IsString } from 'class-validator';

export class PublicAlbumDto {
  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  slug: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @Transform(({ obj }) => format(obj.start_date, 'dd-MMM-yyyy'))
  start_date: Date;

  @Expose()
  @Transform(({ obj }) => format(obj.end_date, 'dd-MMM-yyyy'))
  end_date: Date;

  @Expose()
  @Type(() => PublicAlbumDto)
  title_image: Media;

  @Expose()
  @Type(() => AlbumMediaDto)
  media: AlbumMedia[];
}
