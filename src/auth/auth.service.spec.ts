import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;


  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      create: (createUserDto: {
        name: string;
        email: string;
        password: string;
      }) => {
        const { name, email, password } = createUserDto;
        users.push({ id: Math.random() * 9999, name, email, password } as User);
        return Promise.resolve(users[users.length - 1]);
      },
      findByEmail: (email: string) => {
        const filtered = users.filter((user) => user.email === email);
        return Promise.resolve(filtered.length > 0 ? filtered[0] : null);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });

  it('Create a new User with salted and hashed password', async () => {
    const user = await service.signUp({
      name: 'Erika',
      email: 'erika@mustermann.de',
      password: '123456',
    });
    expect(user).not.toEqual('123456');
    const [header, payload, signature] = user.accessToken.split('.');
    expect(header).toBeDefined();
    expect(payload).toBeDefined();
    expect(signature).toBeDefined();
  });

  it('Throw an error when trying to create a User with an existing email', async () => {
    await service.signUp({
      name: 'Erika',
      email: 'erika@mustermann.de',
      password: '123456',
    });

    await expect(
      service.signUp({
        name: 'Max',
        email: 'erika@mustermann.de',
        password: '123456',
      }),
    ).rejects.toThrow('Email in use');
  });

  it('Throw an error when trying to sign in with an invalid email', async () => {
    await expect(
      service.signIn('erika@mustermann.de', '123456'),
    ).rejects.toThrow('Invalid credentials');
  });

  it('Throw an error when trying to sign in with an invalid password', async () => {
    await expect(service.signIn('erika@mustermann', 'abcdef')).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('Return an access token when signing in with valid credentials', async () => {
    await service.signUp({
      name: 'Erika',
      email: 'erika@mustermann.de',
      password: '123456',
    });

    const token = await service.signIn('erika@mustermann.de', '123456');

    expect(token.accessToken).toBeDefined();
    const [header, payload, signature] = token.accessToken.split('.');
    expect(header).toBeDefined();
    expect(payload).toBeDefined();
    expect(signature).toBeDefined();
  });
});
