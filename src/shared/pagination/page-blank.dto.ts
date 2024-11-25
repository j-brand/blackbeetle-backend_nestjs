import { IsArray } from 'class-validator';
import { PageMetaDto } from './page-meta.dto';
import { Exclude, Expose, Type } from 'class-transformer';

export class PageBlankDto {
  @Exclude()
  private type: Function;

  @Expose()
  @IsArray()
  @Type((options) => (options?.newObject as PageBlankDto)?.type)
  readonly data: any[];

  @Expose()
  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(type: Function) {
    this.type = type;
  }
}
