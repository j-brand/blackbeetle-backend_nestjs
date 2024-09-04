import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ImageService } from './image.service';
import { Media } from '@entities/media.entity';
import { MediaVariation } from '@entities/media_variation.entity';
import { BullModule } from '@nestjs/bullmq';
import { ImageProcessor } from './image.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaVariation]),
    BullModule.registerQueue({
      name: 'image',
    }),
  ],
  providers: [MediaService, ImageService, ImageProcessor],
  controllers: [MediaController],
  exports: [ImageService, MediaService],
})
export class MediaModule {}
