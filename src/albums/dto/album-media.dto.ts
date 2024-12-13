import { Media } from '@app/database/entities/media.entity';
import { MediaDto } from '@app/media/dto/media.dto';
import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AlbumMediaDto {
  @Expose()
  @IsNumber()
  order: number;

  @Expose()
  @Type(() => MediaDto)
  media: Media;
}
