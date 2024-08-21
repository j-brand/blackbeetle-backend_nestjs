import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class Seeder {
  constructor(private readonly usersService: UsersService) {}

  async generate(count: number) {
    try {
      for (let i = 0; i < count; i++) {
        const user = this.getUser();
        await this.usersService.create(user);
        console.log(`${user.name} wurde erstellt.`);
      }

      console.log('\nUser seeded successfully');
    } catch (error) {
      console.error('Failed to seed user:', error);
    }
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
