import { Column, PrimaryGeneratedColumn } from 'typeorm';
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  verified: boolean;

  @Column()
  active: boolean;
}
