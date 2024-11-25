import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class MediaVariationDto {
  @Expose()
  @IsString()
  type: string;

  @Expose()
  @IsString()
  path: string;

  @Expose()
  @IsNumber()
  width: number;

  @Expose()
  @IsNumber()
  height: number;
}
