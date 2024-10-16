import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
