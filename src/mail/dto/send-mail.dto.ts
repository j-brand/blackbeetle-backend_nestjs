import { IsString, IsEmail, IsObject, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  templateName: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  context: Record<string, unknown>;
}
