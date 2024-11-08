import { Expose } from 'class-transformer';

export class CommentDto {
  @Expose()
  name: string;

  @Expose()
  content: string;

  @Expose()
  created_at: Date;
}
