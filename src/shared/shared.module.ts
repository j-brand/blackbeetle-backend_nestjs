import { Module } from '@nestjs/common';
import { MediaService } from './media/media.service';
import { UploadController } from './upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './media/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '@entities/media.entity';

@Module({
  imports: [MulterModule.register({ dest: 'storage' }), TypeOrmModule.forFeature([Media])],
  providers: [MediaService, ImageService],
  controllers: [UploadController],
  exports: [ImageService, MediaService],
})
export class SharedModule {}
