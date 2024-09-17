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
import { CreateMediaDto } from '@app/media/dto/create-media.dto';
import { MediaService } from '@app/media/media.service';
import { AlbumMedia } from '@app/database/entities/album_media.entity';
import { ImageService } from '@app/media/image.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly repo: Repository<Album>,
    private readonly mediaService: MediaService,
    private readonly imageService: ImageService,
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
      relations: ['media'],
    });
    return album;
  }

  async update(
    id: number,
    updateAlbumDto: Partial<UpdateAlbumDto>,
  ): Promise<Album> {
    const album = await this.repo.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    Object.assign(album, updateAlbumDto);
    return this.repo.save(album);
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
  async addImage(id: number, image: CreateMediaDto): Promise<Album> {
    // Find the album by ID, including its media relations
    let album = await this.repo.findOne({
      where: { id },
      relations: ['media'],
    });

    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    // Create a new media entry
    const media = await this.mediaService.create(image);

    // Create a new AlbumMedia instance to link the media to the album
    const albumImage = new AlbumMedia();
    albumImage.media = media;
    albumImage.album = album;
    albumImage.order = album.media.length + 1; // Set the order of the new image
    album.media.push(albumImage); // Add the new image to the album's media list

    // Generate image variations and store them in the album's folder
    this.imageService.generateVariations(
      `${media.path}/${media.title}`,
      `storage/albums/${album.id}`,
      ['webp', 'large', 'thumbnail'],
      media.id,
    );

    const result = await this.repo.save(album);

    return result;
  }
}
