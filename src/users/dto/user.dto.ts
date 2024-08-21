import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  name: string;
  @Expose()
  email: string;

  // JWT payload properties

/*   @Expose()
  username: string;
  @Expose()
  sub: number;
  @Expose()
  iat: number;
  @Expose()
  exp: number; */
}
