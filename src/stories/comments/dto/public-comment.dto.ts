import { Expose, Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { format } from 'date-fns';

export class PublicCommentDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @Transform(({ obj }) => format(obj.created_at, 'dd-MMM-yyyy'))
  created_at: Date;
}
