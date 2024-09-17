import { Module, ValidationPipe } from '@nestjs/common';
import { AlbumsService } from '@albums/albums.service';
import { AlbumsController } from '@albums/albums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '@entities/album.entity';
import { MediaModule } from '@app/media/media.module';
import { APP_PIPE } from '@nestjs/core';
import { AlbumMedia } from '@app/database/entities/album_media.entity';
import { Media } from '@app/database/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, AlbumMedia, Media]), MediaModule],
  controllers: [AlbumsController],
  providers: [
    AlbumsService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AlbumsModule {}
