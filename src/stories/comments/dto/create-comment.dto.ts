import { IsString, IsNotEmpty,IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  post_id: number;
}
