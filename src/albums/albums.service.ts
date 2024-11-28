import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from '@albums/dto/create-album.dto';
import { UpdateAlbumDto } from '@albums/dto/update-album.dto';
import { Album } from '@entities/album.entity';
import { CreateMediaDto } from '@media/dto/create-media.dto';
import { MediaService } from '@media/media.service';
import { AlbumMedia } from '@database/entities/album_media.entity';
import { PageDto } from '@shared/pagination/page.dto';
import { AlbumDto } from './dto/album.dto';
import { PublicAlbumDto } from './dto/public-album.dto';
import { PageOptionsDto } from '@shared/pagination/page-options.dto';
import { PageMetaDtoFactory } from '@shared/pagination/page-meta.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly repo: Repository<Album>,
    private readonly mediaService: MediaService,
    @InjectRepository(AlbumMedia)
    private readonly albumMediaRepo: Repository<AlbumMedia>,
  ) {}

  async create(
    createAlbumDto: CreateAlbumDto,
    title_image?: Express.Multer.File,
  ): Promise<Album> {
    const exists = await this.repo.findOne({
      where: { slug: createAlbumDto.slug },
    });

    if (exists) {
      throw new UnprocessableEntityException(
        'Album with this slug already exists',
      );
    }
    const album = this.repo.create(createAlbumDto);

    let newAlbum = await this.repo.save(album);

    if (title_image) {
      newAlbum = await this.update(
        newAlbum.id,
        {} as UpdateAlbumDto,
        title_image,
      );
    }

    return newAlbum;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    active_only?: boolean,
  ): Promise<PageDto<AlbumDto | PublicAlbumDto>> {
    const [albums, itemCount] = await this.repo.findAndCount({
      where: active_only ? { active: true } : {},
      order: { end_date: 'DESC' },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    });

    const pageMetaDto = PageMetaDtoFactory.create({
      pageOptionsDto,
      itemCount,
    });

    return new PageDto(albums, pageMetaDto);
  }

  async findOne(id: number): Promise<Album> {
    const album = await this.repo.findOne({
      where: { id },
      relations: ['media', 'title_image'],
    });
    this.ensureAlbumExists(album, id);
    return album;
  }

  async findAlbumBySlug(slug: string, active_only?: boolean): Promise<Album> {
    const album = await this.repo.findOne({
      where: active_only ? { slug: slug, active: true } : { slug: slug },
      relations: ['media', 'title_image'],
    });

    this.ensureAlbumExists(album, slug);

    return album;
  }

  async update(
    id: number,
    updateAlbumDto: Partial<UpdateAlbumDto>,
    title_image?: Express.Multer.File,
  ): Promise<Album> {
    const album = await this.repo.findOne({
      where: { id },
    });
    this.ensureAlbumExists(album, id);

    let oldImage = null;
    if (title_image) {
      oldImage = album.title_image;

      const newImage = await this.mediaService.create(
        {
          title: title_image.filename,
          path: `storage/albums/${id}`,
          upload_path: `storage/upload/tmp`,
          type: 'IMAGE',
        } as CreateMediaDto,
        ['album_cover', 'og_image'],
      );
      updateAlbumDto.title_image = newImage;
    }

    Object.assign(album, updateAlbumDto);
    const result = this.repo.save(album);

    //remove old image
    if (oldImage) {
      this.mediaService.remove(oldImage.id);
    }

    return result;
  }

  async remove(id: number): Promise<Album> {
    const album = await this.repo.findOne({
      where: { id },
      relations: ['media', 'title_image'],
    });
    this.ensureAlbumExists(album, id);

    album.media.forEach(async (media) => {
      await this.mediaService.remove(media.media.id);
    });

    await this.mediaService.remove(album.title_image.id);

    const albumFolderPath = path.join('storage/albums', `${album.slug}`);
    if (fs.existsSync(albumFolderPath)) {
      fs.rmSync(albumFolderPath, { recursive: true, force: true });
    }

    return this.repo.remove(album);
  }

  /**
   * Adds an image to an album.
   *
   * @param id - The ID of the album to which the image will be added.
   * @param image - The image data to be added to the album.
   * @returns The updated album with the new image.
   * @throws NotFoundException if the album with the given ID is not found.
   */
  async addImage(id: number, image: Express.Multer.File): Promise<Album> {
    // Find the album by ID, including its media relations
    let album = await this.repo.findOne({
      where: { id },
      relations: ['media'],
    });

    this.ensureAlbumExists(album, id);

    // Create a new media, store it in the database and create image variations
    const newMedia = await this.mediaService.create(
      {
        title: image.filename,
        path: `storage/albums/${id}`,
        upload_path: `storage/upload/tmp`,
        type: 'IMAGE',
      } as CreateMediaDto,
      ['webp', 'large', 'thumbnail'],
    );

    // Create a new AlbumMedia instance to link the media to the album
    const albumImage = new AlbumMedia();
    albumImage.media = newMedia;
    albumImage.album = album;
    albumImage.order = album.media.length + 1; // Set the order of the new image
    album.media.push(albumImage); // Add the new image to the album's media list

    return await this.repo.save(album);
  }

  /**
   * Removes an image from an album.
   *
   * @param albumId - The ID of the album from which the image will be removed.
   * @param imageId - The ID of the image to be removed from the album.
   * @returns The updated album without the removed image.
   * @throws NotFoundException if the album with the given ID is not found.
   */
  async removeImage(albumId: number, imageId: number): Promise<Album> {
    // Find the album by ID, including its media relations
    let album = await this.repo.findOne({
      where: { id: albumId },
      relations: ['media'],
    });
    this.ensureAlbumExists(album, albumId);

    // Find the AlbumMedia instance linking the media to the album
    const albumImage = album.media.find((image) => image.media.id === imageId);

    if (!albumImage) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found in album with ID ${albumId}`,
      );
    }

    // Remove the image from the album's media list
    album.media = album.media.filter((image) => image.media.id !== imageId);

    // Remove the AlbumMedia instance from the database
    await this.mediaService.remove(imageId);

    return album;
  }

  async updateImageOrder(
    albumId: number,
    imageId1: number,
    imageId2: number,
  ): Promise<void> {
    // Find the AlbumMedia entries for the two images within the specified album
    const albumMedia1 = await this.albumMediaRepo.findOne({
      where: { album: { id: albumId }, media: { id: imageId1 } },
    });

    const albumMedia2 = await this.albumMediaRepo.findOne({
      where: { album: { id: albumId }, media: { id: imageId2 } },
    });

    if (!albumMedia1) {
      throw new NotFoundException(
        `Image with ID ${imageId1} not found in album with ID ${albumId}`,
      );
    }

    if (!albumMedia2) {
      throw new NotFoundException(
        `Image with ID ${imageId2} not found in album with ID ${albumId}`,
      );
    }

    // Swap the order values of the two AlbumMedia entries
    const tempOrder = albumMedia1.order;
    albumMedia1.order = albumMedia2.order;
    albumMedia2.order = tempOrder;

    // Save the updated AlbumMedia entries back to the database
    await this.albumMediaRepo.save([albumMedia1, albumMedia2]);
  }

  private ensureAlbumExists(album: Album, id: number | string): void {
    let entity = 'ID';
    if (typeof id === 'string') {
      entity = 'Slug';
    }
    if (!album) {
      throw new NotFoundException(`Album with ${entity} ${id} not found`);
    }
  }
}
