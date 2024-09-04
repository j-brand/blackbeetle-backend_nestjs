import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Media } from "./media.entity";

@Entity()
export class MediaVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string; // URL of the media variation

  @Column()
  type: string; // Type of variation (e.g., 'thumbnail', 'medium', 'large')
  
  @Column({ nullable: true })
  width: number; // Width of the variation (if applicable)
  
  @Column({ nullable: true })
  height: number; // Height of the variation (if applicable)

  @ManyToOne(() => Media, media => media.variations, {onDelete: 'CASCADE'})
  media: Media;
}