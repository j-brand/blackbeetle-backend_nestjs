import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, diskStorageConf } from './upload.utils';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { ImageService } from '../media/image.service';
import { DeleteFileOnFailFilter } from '../filters/delete-file-on-fail/delete-file-on-fail.filter';
import { MediaService } from '../media/media.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly imageService: ImageService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  @UseFilters(DeleteFileOnFailFilter)
  async uploadImage(
    @Body() body: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const variations = await this.imageService.generateImageVariations(
      `${file.destination}/${file.filename}`,
      `storage/${body.path}/${body.entity_id}`,
      ['webp', 'large', 'thumbnail'],
    );
    //console.log(variations);
    body.title = file.filename;
    body.path = file.path;
    return this.mediaService.create(body, variations);
  }
}
