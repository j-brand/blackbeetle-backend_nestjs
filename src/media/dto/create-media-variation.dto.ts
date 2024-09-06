import { Media } from '@entities/media.entity';
import { IsNumber, isNumber, IsOptional, IsString } from 'class-validator';

export class CreateMediaVariationDto {
  @IsString()
  path: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  width: number;

  @IsOptional()
  @IsNumber()
  height: number;

  media: Media;
}
