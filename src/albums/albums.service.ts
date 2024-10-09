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

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly repo: Repository<Album>,
    private readonly mediaService: MediaService,
    @InjectRepository(AlbumMedia)
    private readonly albumMediaRepo: Repository<AlbumMedia>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const exists = await this.repo.findOne({
      where: { slug: createAlbumDto.slug },
    });
    if (exists) {
      throw new UnprocessableEntityException(
        'Album with this slug already exists',
      );
    }

    const album = this.repo.create(createAlbumDto);
    return this.repo.save(album);
  }

  async findAll(): Promise<Album[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Album> {
    const album = await this.repo.findOne({
      where: { id },
      relations: ['media', 'title_image'],
    });
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
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    let oldImage = null;
    if (title_image) {
      oldImage = album.title_image;

      const newImage = await this.mediaService.create(
        {
          title: title_image.filename,
          path: `storage/albums/${id}`,
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
      relations: ['media'],
    });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    album.media.forEach((media) => {
      this.mediaService.remove(media.media.id);
    });
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

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    // Create a new media, store it in the database and create image variations
    const newMedia = await this.mediaService.create(
      {
        title: image.filename,
        path: `storage/albums/${id}`,
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

    if (!album) {
      throw new NotFoundException(`Album with ID ${albumId} not found`);
    }

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

  async swapAlbumImages(
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
}
