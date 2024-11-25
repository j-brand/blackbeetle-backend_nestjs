import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
