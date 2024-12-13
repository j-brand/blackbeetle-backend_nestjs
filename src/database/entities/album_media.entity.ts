import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  RemoveEvent,
} from 'typeorm';
import { Album } from '@entities/album.entity';
import { Media } from '@entities/media.entity';

@Entity()
export class AlbumMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Album, (album) => album.media, {
    onDelete: 'CASCADE',
  })
  album: Album;

  @ManyToOne(() => Media, (media) => media.albums, {
    eager: true,
    onDelete: 'CASCADE',
  })
  media: Media;
}
