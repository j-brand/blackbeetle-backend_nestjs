import { Module, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
  exports: [UsersService],
})
export class UsersModule {}
