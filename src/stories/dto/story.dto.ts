import { TitleImageDto } from '@media/dto/title-image.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { format } from 'date-fns';

export class StoryDto {
  @Expose()
  @IsString()
  readonly title: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @IsString()
  readonly slug: string;

  @Expose()
  @Type(() => TitleImageDto)
  readonly title_image: TitleImageDto;

  @Expose()
  @IsDateString()
  @Transform(({ obj }) => format(obj.created_at, 'dd-MMM-yyyy'))
  readonly created_at: Date;

  @Expose()
  @IsNumber()
  readonly posts_count: number;
}
