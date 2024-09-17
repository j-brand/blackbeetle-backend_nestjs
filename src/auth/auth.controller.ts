import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { SignInDto } from '@auth/dto/sign-in.dto';
import { SignUpDto } from '@auth/dto/sign-up.dto';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';
import { AuthDto } from '@auth/dto/auth.dto';

@Controller('auth')
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    const token = await this.authService.signIn(body.email, body.password);
    return token;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    const user = await this.authService.signUp(body);
    return user;
  }
}
