import { AlbumsService } from '@albums/albums.service';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';

export class AlbumsSeeder {
  constructor(private readonly albumsService: AlbumsService) {}

  async seed(count: number) {
    const albums = Array.from({ length: count }, async () => {
      const albumData = this.getAlbum();
      return await this.albumsService.create(albumData);
    });
    Logger.log(`${count} albums created`, 'Albums Seeder');

    return Promise.all(albums);
  }

  private getAlbum(): CreateAlbumDto {
    return {
      title: faker.lorem.words(3),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
    };
  }
}
