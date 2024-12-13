import { Controller, Get, Param, Query, SetMetadata } from '@nestjs/common';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageDto } from '@shared/pagination/page.dto';
import { PublicAlbumDto } from './dto/public-album.dto';
import { AlbumsService } from './albums.service';
import { Serialize } from '@shared/interceptors/serialize/serialize.interceptor';

@Controller('public/albums')
@Serialize(PublicAlbumDto)
export class PublicAlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @SetMetadata('paginate', true)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PublicAlbumDto>> {
    return await this.albumsService.findAll(pageOptionsDto, true);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.albumsService.findAlbumBySlug(slug, true);
  }
}
