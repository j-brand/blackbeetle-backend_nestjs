import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { Post } from '@entities/post.entity';
import { Media } from '@entities/media.entity';

@Entity()
export class PostMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Post, (post) => post.media, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => Media, (media) => media.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  media: Media;
}
