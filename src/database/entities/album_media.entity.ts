import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Album } from "./album.entity";
import { Media } from "./media.entity";

@Entity()
export class AlbumMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Album, album => album.id)
  album: Album;

  @ManyToOne(() => Media, media => media.id)
  media: Media;
}