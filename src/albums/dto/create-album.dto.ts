import { Media } from '@entities/media.entity';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  title_image: Media;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  start_date: Date;

  @IsOptional()
  @IsDate()
  end_date: Date;
}
