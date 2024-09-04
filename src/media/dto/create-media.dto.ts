import { MediaVariation } from '@entities/media_variation.entity';
import { IsEnum, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
 
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  path: string;

  @IsString()
  entity_id: string;

  @IsEnum(['IMAGE', 'VIDEO', 'AUDIO'])
  type: string;

  @IsOptional()
  variations: MediaVariation[];

  file: Express.Multer.File;
}
