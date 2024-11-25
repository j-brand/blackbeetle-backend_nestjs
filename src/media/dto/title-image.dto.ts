import { Expose, Type } from 'class-transformer';
import { MediaVariationDto } from './media-variation.dto';

export class TitleImageDto{
    @Expose()
    path: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    @Type(() => MediaVariationDto)
    variations: MediaVariationDto[];
}