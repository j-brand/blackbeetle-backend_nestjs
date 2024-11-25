import { Media } from '@app/database/entities/media.entity';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
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
  active: boolean;
}
