import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Media } from '@entities/media.entity';
import { AlbumMedia } from './album_media.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @OneToOne(() => Media, { nullable: true })
  title_image: Media;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AlbumMedia, (albumMedia) => albumMedia.album, {
    nullable: true,
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: AlbumMedia[];
}
