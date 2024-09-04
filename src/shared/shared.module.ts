import { Module } from '@nestjs/common';
import { UploadController } from './upload/upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MediaModule } from 'src/media/media.module';


@Module({
  imports: [MulterModule.register({ dest: 'storage' }), MediaModule],
  providers: [],
  controllers: [UploadController, ],
  exports: [],
})
export class SharedModule {}
