import { Expose } from 'class-transformer';
import { PageOptionsDto } from './page-options.dto';
import { IsBoolean, IsInt } from 'class-validator';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {

  @Expose()
  @IsInt()
  readonly page: number;

  @Expose()
  @IsInt()
  readonly take: number;

  @Expose()
  @IsInt()
  readonly totalItems: number;

  @Expose()
  @IsInt()
  readonly pages: number;

  @Expose()
  @IsBoolean()
  readonly hasPrevious: boolean;
  
  @Expose()
  @IsBoolean()
  readonly hasNext: boolean;
}

export class PageMetaDtoFactory {
  static create({ pageOptionsDto, itemCount }: PageMetaDtoParameters): PageMetaDto {
    
    const pages = Math.ceil(itemCount / pageOptionsDto.take);

    return {
      page: pageOptionsDto.page,
      take: pageOptionsDto.take,
      totalItems: itemCount,
      pages: pages,
      hasPrevious: pageOptionsDto.page > 1,
      hasNext: pageOptionsDto.page < pages,
    };
  }
}