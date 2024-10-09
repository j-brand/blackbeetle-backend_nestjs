import { MediaVariation } from '@entities/media_variation.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
 
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  path: string;

  //Delete?
  @IsOptional()
  @IsString()
  entity_id: string;

  @IsEnum(['IMAGE', 'VIDEO', 'AUDIO'])
  type: string;

  @IsOptional()
  variations: MediaVariation[];
}
