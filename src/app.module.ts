import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './database/typeorm.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AlbumsModule } from './albums/albums.module';
import { Seeder } from './database/seed/users.seeder';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), UsersModule, AlbumsModule, AuthModule, SharedModule],
  controllers: [AppController],
  providers: [AppService, Seeder],
})
export class AppModule {}
