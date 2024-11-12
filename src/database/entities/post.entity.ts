import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@entities/user.entity';
import { Story } from '@entities/story.entity';
import { Comment } from '@entities/comment.entity';
import { PostMedia } from '@entities/post_media.entity';

export enum PostType {
  HTML = 'HTML',
  IMAGE = 'IMAGE',
  VIEO = 'VIDEO',
  MAP = 'MAP',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @ManyToOne(() => Story, (story) => story.posts)
  story: Story;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 1 })
  order: number;

  @Column({ type: 'simple-enum', enum: PostType, default: PostType.HTML })
  type: PostType;

  @Column({ default: false })
  active: boolean;

  @OneToMany(() => Comment, (comment) => comment.post, {
    nullable: true
  })
  comments: Comment[];

  @OneToMany(() => PostMedia, (postMedia) => postMedia.post, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  media: PostMedia[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
