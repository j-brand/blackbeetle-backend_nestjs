import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from '@media/media.service';
import { MediaController } from '@media/media.controller';
import { ImageService } from '@media/image.service';
import { Media } from '@entities/media.entity';
import { MediaVariation } from '@entities/media_variation.entity';
import { BullModule } from '@nestjs/bullmq';
import { ImageProcessor } from '@media/image.processor';
import { AlbumMedia } from '@app/database/entities/album_media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaVariation, AlbumMedia]),
    BullModule.registerQueue({
      name: 'image',
    }),
  ],
  providers: [MediaService, ImageService, ImageProcessor],
  controllers: [MediaController],
  exports: [ImageService, MediaService],
})
export class MediaModule {}
