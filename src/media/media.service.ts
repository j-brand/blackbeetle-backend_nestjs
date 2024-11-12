import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Media } from '@entities/media.entity';

import { CreateMediaDto } from '@media/dto/create-media.dto';
import { UpdateMediaDto } from '@media/dto/update-media.dto';
import { MediaVariation } from '@entities/media_variation.entity';
import { CreateMediaVariationDto } from '@media/dto/create-media-variation.dto';
import { ImageService } from './image.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly repo: Repository<Media>,
    @InjectRepository(MediaVariation)
    private readonly variationRepo: Repository<MediaVariation>,
    private readonly imageService: ImageService,
  ) {}

  async create(media: CreateMediaDto, variations?: string[]): Promise<Media> {
    const filePath = path.join(media.upload_path, media.title);
    const destinationPath = path.join(media.path, media.title);

    if (fs.existsSync(filePath)) {
      // Ensure the destination directory exists
      fs.mkdirSync(media.path, { recursive: true });
      fs.copyFileSync(filePath, destinationPath);
    } else {
      throw new Error(`File at path ${filePath} does not exist`);
    }

    const newMedia = await this.repo.save(media);

    if (variations) {
      await this.imageService.generateVariations(
        `${media.path}/${media.title}`,
        media.path,
        variations,
        newMedia.id,
      );
    }

    return newMedia;
  }

  async createVariation(variation: CreateMediaVariationDto): Promise<Media> {
    const newVariation = this.variationRepo.create(variation);
    await this.variationRepo.save(newVariation);

    return this.findOne(newVariation.media.id);
    //return this.repo.save(media);
  }

  async findAll(): Promise<Media[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Media> {
    const media = await this.repo.findOne({
      where: { id },
      relations: ['variations'],
    });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  async update(
    id: number,
    updateMediaDto: Partial<UpdateMediaDto>,
  ): Promise<Media> {
    const media = await this.repo.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    Object.assign(media, updateMediaDto);
    return this.repo.save(media);
  }

  async remove(id: number): Promise<Media> {
    const media = await this.repo.findOne({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return await this.repo.remove(media);
  }
}
