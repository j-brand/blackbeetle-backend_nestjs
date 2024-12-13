import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { User } from '@entities/user.entity';

@Injectable()
export class UsersSeeder {
  constructor(private readonly usersService: UsersService) {}

  async seed(count: number): Promise<User[]> {
    const users = Array.from({ length: count }, async () => {
      const userData = this.getUser();
      return await this.usersService.create(userData);
    });
    Logger.log(`${count} users created`, 'Users Seeder');

    return Promise.all(users);
  }

  getUser(): CreateUserDto {
    const user: CreateUserDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    return user;
  }
}
