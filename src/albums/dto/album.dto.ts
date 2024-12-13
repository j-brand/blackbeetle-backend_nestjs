import { AlbumMedia } from '@app/database/entities/album_media.entity';
import { Media } from '@app/database/entities/media.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { AlbumMediaDto } from './album-media.dto';
import { MediaDto } from '@media/dto/media.dto';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { format } from 'date-fns';

export class AlbumDto {
  @Expose()
  @IsNumber()
  id: number;

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
  @IsBoolean()
  active: boolean;

  @Expose()
  @Transform(({ obj }) => format(obj.end_date, 'dd-MMM-yyyy'))
  @IsDateString()
  start_date: Date;

  @Expose()
  @Transform(({ obj }) => format(obj.end_date, 'dd-MMM-yyyy'))
  @IsDateString()
  end_date: Date;

  @Expose()
  @Type(() => MediaDto)
  title_image: Media;

  @Expose()
  @Type(() => AlbumMediaDto)
  media: AlbumMedia[];
}
