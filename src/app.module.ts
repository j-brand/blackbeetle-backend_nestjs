import { Module, ValidationPipe } from '@nestjs/common';

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from '@database/typeorm.config';

import { queueConfig } from '@app/queue.config';

import { AuthModule } from '@auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { MediaModule } from '@media/media.module';
import { UsersModule } from '@users/users.module';
import { AlbumsModule } from '@albums/albums.module';

import { Seeder } from '@seed/users.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    queueConfig,
    UsersModule,
    AlbumsModule,
    AuthModule,
    SharedModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, Seeder],
})
export class AppModule {}
