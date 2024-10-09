import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterRemove,
} from 'typeorm';
import { MediaVariation } from '@entities/media_variation.entity';
import { AlbumMedia } from './album_media.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string; // URL of the original media file

  @Column()
  type: string; // Type of media (e.g., 'image', 'video', 'audio')

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => MediaVariation, (variation) => variation.media, {
    eager: true,
  })
  variations: MediaVariation[];

  @OneToMany(() => AlbumMedia, (albumMedia) => albumMedia.media)
  albums: AlbumMedia[];

}
