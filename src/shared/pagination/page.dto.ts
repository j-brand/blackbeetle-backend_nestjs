import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { Expose, Type } from 'class-transformer';
import { PageBlankDto } from './page-blank.dto';

export class PageDto<T> extends PageBlankDto {
  
  @Expose()
  @IsArray()
  readonly data: T[];

  @Expose()
  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    super(data[0].constructor);

    this.data = data;
    this.meta = meta;
  }
}
