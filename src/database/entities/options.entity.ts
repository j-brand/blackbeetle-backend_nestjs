import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Options {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'json' })
  content: any;
}
