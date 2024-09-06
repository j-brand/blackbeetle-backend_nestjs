import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';
import { User } from '@entities/user.entity';
import { AuthService } from '@auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id: 33,
          name: 'Erika Mustermann',
          email: 'mustermann@domain.de',
        } as User);
      },
      findAll: () => {
        return Promise.resolve([
          {
            id: 33,
            name: 'Erika Mustermann',
            email: 'mustermann@domain.de',
          },
        ] as User[]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Find one User by a given ID', async () => {
    const user = await controller.findOne('33');
    expect(user).toBeDefined();
    expect(user.id).toEqual(33);
  });

  it('Find all users', async () => {
    const users = await controller.findAll();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThanOrEqual(0);
  });
});
