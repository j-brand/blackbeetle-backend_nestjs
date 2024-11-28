import { Media } from '@entities/media.entity';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  title_image?: Media;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  start_date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  end_date: Date;
}
