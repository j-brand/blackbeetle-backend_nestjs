import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Media } from '../../database/entities/media.entity';

import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaVariation } from '@entities/media_variation.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly repo: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto, variations?: MediaVariation[]): Promise<Media> {
    const media = await this.repo.create(createMediaDto);
    
    
    if (variations) {
      media.variations = [];
      variations.forEach(async (variation) => {
        const vari = new MediaVariation();
        vari.path = variation.path;
        vari.type = variation.type;
        vari.width = variation.width;
        vari.height = variation.height
        media.variations.push(vari);
      });
    }

    return this.repo.save(media);
  }

  async createVariations(
    variations: MediaVariation[],
    media: Media,
  ): Promise<Media> {
    variations.forEach(async (variation) => {
      const vari = this.repo.create(variation);
    });
    return this.repo.save(media);
  }

  async findAll(): Promise<Media[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Media> {
    const media = await this.repo.findOne({ where: { id } });
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
    const media = await this.repo.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return this.repo.remove(media);
  }
}
