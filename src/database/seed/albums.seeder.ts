import { AlbumsService } from '@albums/albums.service';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export class AlbumsSeeder {
  constructor(private readonly albumsService: AlbumsService) {}
  readonly imageCount = 3;

  async seed(count: number) {
    const albums = Array.from({ length: count }, async () => {
      const albumData = this.getAlbum();
      const title_image = await this.getImage();
      const album = await this.albumsService.create(albumData, title_image);
      await this.fillAlbum(album.id, this.imageCount);
      return album;
    });
    Logger.log(`${count} albums created`, 'Albums Seeder');

    return Promise.all(albums);
  }

  fillAlbum(albumId: number, count: number) {
    const images = Array.from({ length: count }, async () => {
      const image = await this.getImage();
      return await this.albumsService.addImage(albumId, image);
    });
    Logger.log(`${count} images added to album ${albumId}`, 'Albums Seeder');

    return Promise.all(images);
  }

  private getAlbum(): CreateAlbumDto {
    return {
      title: faker.lorem.words(3),
      slug: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      start_date: faker.date.past(),
      end_date: faker.date.future(),
    };
  }

  private async getImage(): Promise<Express.Multer.File> {
    const sourcePath = 'storage/static/img_01.jpg';
    const newFileName = `img_${Date.now()}.jpg`;
    const destinationPath = path.join('storage/upload/tmp', newFileName);

    await fs.promises.copyFile(sourcePath, destinationPath);

    const file = {
      fieldname: 'image',
      originalname: newFileName,
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: await fs.promises.readFile(destinationPath),
      size: (await fs.promises.stat(destinationPath)).size,
    };

    const multerFile = {
      ...file,
      stream: fs.createReadStream(destinationPath),
      destination: 'storage/static',
      filename: newFileName,
      path: destinationPath,
    };

    return multerFile;
  }
}
