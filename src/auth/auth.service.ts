import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _ascript } from 'crypto';
import { promisify } from 'util';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@entities/user.entity';

const scrypt = promisify(_ascript);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    // See if the email is in use
    const users = await this.usersService.findByEmail(dto.email);
    if (users) {
      throw new BadRequestException('Email in use');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the user's password
    const hash = (await scrypt(dto.password, salt, 32)) as Buffer;

    // Join the salt and hashed password
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: result,
    });
    const accessToken = await this.createAccessToken(user);

    return accessToken;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    // Find the user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { username: user.name, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken: accessToken };
  }

  protected async createAccessToken(
    user: User,
  ): Promise<{ accessToken: string }> {
    const payload = { username: user.name, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken: accessToken };
  }
}
