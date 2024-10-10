import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, diskStorageConf } from '@upload/upload.utils';
import { CreateMediaDto } from '@media/dto/create-media.dto';
import { ImageService } from '@media/image.service';
import { DeleteFileOnFailFilter } from '@shared/filters/delete-file-on-fail/delete-file-on-fail.filter';
import { MediaService } from '@media/media.service';
import { UploadImagesDto } from './dto/upload-images.dto';

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
    const destinationPath = `storage/${body.path}/${body.entity_id}`;
    body.title = file.filename;
    body.path = file.path;
    const media = await this.mediaService.create(body);

    this.imageService.generateVariations(
      file.path,
      destinationPath,
      ['webp', 'large', 'thumbnail'],
      media.id,
    );

    return media;
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  async UploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: UploadImagesDto,
  ) {
    //const destinationPath = `storage/albums/${albumId}`;

    console.log(files);

    /*     files.forEach(async (file) => {
      const newMedia = {
        title: file.filename,
        path: file.path,
        entity_id: body.entity_id,
        type: 'IMAGE',
        file: file,
      } as CreateMediaDto;

      const media = await this.mediaService.create();
    }); */

    return files;
  }
}
