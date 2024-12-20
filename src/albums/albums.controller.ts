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
  UploadedFile,
  UseFilters,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { AlbumsService } from '@albums/albums.service';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { UpdateAlbumDto } from '@albums/dto/update-album.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorageConf, imageFileFilter } from '@shared/upload/upload.utils';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';
import { AlbumDto } from '@albums/dto/album.dto';
import { DeleteFileOnFailFilter } from '@shared/filters/delete-file-on-fail/delete-file-on-fail.filter';
import { PageDto } from '@shared/pagination/page.dto';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';

@Controller('albums')
@Serialize(AlbumDto)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('title_image', {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  @UseFilters(DeleteFileOnFailFilter)
  create(
    @Body() createAlbumDto: CreateAlbumDto,
    @UploadedFile() title_image: Express.Multer.File,
  ) {
    console.log(title_image);
    return this.albumsService.create(createAlbumDto, title_image);
  }

  @Get()
  @SetMetadata('paginate', true)
  async findAll(@Query() pageOptionsDto: PageOptionsDto):Promise<PageDto<AlbumDto>> {
    return await  this.albumsService.findAll(pageOptionsDto) as PageDto<AlbumDto>;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('title_image', {
      storage: diskStorageConf,
      fileFilter: imageFileFilter,
    }),
  )
  @UseFilters(DeleteFileOnFailFilter)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAlbumDto,
    @UploadedFile() title_image: Express.Multer.File,
  ) {
    const response = await this.albumsService.update(
      +id,
      data,
      title_image ? title_image : null,
    );

    return response;
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
    @Param('id') id: string,
  ) {
    for (const file of files) {
      await this.albumsService.addImage(+id, file);
    }
  }

  @Delete(':id/images/:imageId')
  async removeImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    return this.albumsService.removeImage(+id, +imageId);
  }
}
