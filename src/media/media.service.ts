import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Media } from '@entities/media.entity';

import { CreateMediaDto } from '@media/dto/create-media.dto';
import { UpdateMediaDto } from '@media/dto/update-media.dto';
import { MediaVariation } from '@entities/media_variation.entity';
import { CreateMediaVariationDto } from '@media/dto/create-media-variation.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly repo: Repository<Media>,
    @InjectRepository(MediaVariation)
    private readonly variationRepo: Repository<MediaVariation>,
  ) {}

  async create(
    createMediaDto: CreateMediaDto,
    variations?: CreateMediaVariationDto[],
  ): Promise<Media> {
    const media = await this.repo.create(createMediaDto);

    if (variations) {
      media.variations = [];
      variations.forEach(async (variation) => {
        const vari = new MediaVariation();
        vari.path = variation.path;
        vari.type = variation.type;
        vari.width = variation.width;
        vari.height = variation.height;
        media.variations.push(vari);
      });
    }

    const newMedia = await this.repo.save(media);

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
      relations: ['variations'],
    });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return this.repo.remove(media);
  }
}
