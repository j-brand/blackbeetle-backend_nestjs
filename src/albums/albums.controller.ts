import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AlbumsService } from '@albums/albums.service';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { UpdateAlbumDto } from '@albums/dto/update-album.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  diskStorageConf,
  imageFileFilter,
} from '@app/shared/upload/upload.utils';
import { AddImagesDto } from './dto/add-image.dto';
import { MediaService } from '@app/media/media.service';
import { CreateMediaDto } from '@app/media/dto/create-media.dto';
import { Serialize } from '@app/shared/interceptors/serialize/serialize.interceptor';
import { AlbumDto } from './dto/album.dto';
import { Media } from '@app/database/entities/media.entity';

@Controller('albums')
@Serialize(AlbumDto)
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(+id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }

  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  async addImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') albumId: string,
    @Body() body: AddImagesDto,
  ) {
    const destinationPath = `storage/albums/${albumId}`;

    let images = files.map((file) => {
      let newMedia = new CreateMediaDto();
      newMedia.title = file.filename;
      newMedia.path = destinationPath;
      newMedia.type = 'IMAGE';
      return newMedia;
    });

    for (let i = 0; i <= images.length - 1; i++) {
      await this.albumsService.addImage(+albumId, images[i]);
    }

    return this.albumsService.findOne(+albumId);
  }
}
