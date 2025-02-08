import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import sqliteConfig from '@database/sqlite.config';
import mariadbConfig from '@database/mariadb.config';

import { queueConfig } from './queue.config';

import { AuthModule } from '@auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { MediaModule } from '@media/media.module';
import { UsersModule } from '@users/users.module';
import { AlbumsModule } from '@albums/albums.module';
import { StoriesModule } from '@stories/stories.module';
import { MailModule } from '@mail/mail.module';
import { NODE_ENV } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [sqliteConfig, mariadbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT
          ? sqliteConfig()
          : mariadbConfig();
      },
    }),
    queueConfig,
    UsersModule,
    AlbumsModule,
    AuthModule,
    SharedModule,
    MediaModule,
    StoriesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
