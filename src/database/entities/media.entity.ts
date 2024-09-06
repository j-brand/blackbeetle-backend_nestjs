import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { MediaVariation } from "./media_variation.entity";
import { Album } from "./album.entity";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string; // URL of the original media file

  @Column()
  type: string; // Type of media (e.g., 'image', 'video', 'audio')

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => MediaVariation, variation => variation.media)
  variations: MediaVariation[];

  @OneToMany(() => Album, album => album.title_image)
  album: Album;
}