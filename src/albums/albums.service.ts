import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '../database/entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly repo: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = this.repo.create(createAlbumDto);
    return this.repo.save(album);
  }

  async findAll(): Promise<Album[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Album> {
    const album = await this.repo.findOne({ where: { id } });
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

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return true;
  }
}
