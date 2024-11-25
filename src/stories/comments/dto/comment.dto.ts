import { Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';

export class CommentDto {
  @Expose()
  name: string;

  @Expose()
  content: string;

  @Expose()
  @Transform(({ obj }) => format(obj.created_at, 'dd-MMM-yyyy'))
  created_at: Date;
}
