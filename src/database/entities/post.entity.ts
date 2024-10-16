import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Story } from './story.entity';

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
  user: User;

  @ManyToOne(() => Story, (story) => story.posts)
  story: Story;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column()
  type: 'enum';
  enum: PostType;
  default: PostType.HTML;

  @Column()
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
