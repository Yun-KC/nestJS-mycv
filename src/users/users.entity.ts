import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column()
  email: string;

  @Column()
  password: string;
}
