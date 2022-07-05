import { IsEmail } from 'class-validator';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`방금 삽입한 사용자 ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`방금 수정한 사용자 ${this.id}`);
  }

  @AfterRemove()
  logRemover() {
    console.log(`방금 제거한 사용자 ${this.id}`);
  }
}
