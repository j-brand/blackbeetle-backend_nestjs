import { Expose } from 'class-transformer';

export class AuthDto {
  @Expose()
  email: string;
  @Expose()
  accessToken: string;
}
