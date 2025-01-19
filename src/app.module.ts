import { Module } from '@nestjs/common';

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import sqliteConfig from '@database/sqlite.config';
import mysqlConfig from '@database/mysql.config';

import { queueConfig } from '@app/queue.config';

import { AuthModule } from '@auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { MediaModule } from '@media/media.module';
import { UsersModule } from '@users/users.module';
import { AlbumsModule } from '@albums/albums.module';
import { StoriesModule } from '@stories/stories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [sqliteConfig, mysqlConfig],
    }),
    TypeOrmModule.forRootAsync({ useFactory: process.env.NODE_ENV === 'development' ? sqliteConfig : mysqlConfig }),
    queueConfig,
    UsersModule,
    AlbumsModule,
    AuthModule,
    SharedModule,
    MediaModule,
    StoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
