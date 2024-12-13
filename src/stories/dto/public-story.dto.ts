import { TitleImageDto } from '@media/dto/title-image.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';
import { format } from 'date-fns';

export class PublicStoryDto {
  @Expose()
  @IsString()
  readonly title: string;

  @Expose()
  @IsString()
  readonly slug: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @IsDateString()
  @Transform(({ obj }) => format(obj.created_at, 'dd-MMM-yyyy'))
  readonly created_at: Date;

  @Expose()
  @Type(() => TitleImageDto)
  readonly title_image: TitleImageDto;

  @Expose()
  @IsNumber()
  readonly posts_count: number;
}
