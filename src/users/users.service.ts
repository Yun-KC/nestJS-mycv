import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { validate } from 'class-validator';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  async create({ email, password }: { email: string; password: string }) {
    /* 
    repo.create 메서드는 자동으로 유효성 검사를 하지 않는다.
    import {validate} from "class-validator" validate를 불러와 유효성 검사를 수동으로 합니다.
    이때 validate는 프로미스를 리턴하므로 메서드를 async로 바꿔주거나 then으로 에러를 핸들링합니다.
    
    아래 코드는 user.entity.ts 파일에서 정의한 엔티티의 형식과 벗어났지만
    에러를 일으키지 않는다.
    1. email 형식이 아님
    2. password 속성이 없음

    const test = this.repo.create({
      email: '나는 이메일아니야',
    });
  
    */

    const user = this.repo.create({ email, password });
    const resultForValidateUserEntity = await validate(user);
    if (resultForValidateUserEntity.length !== 0)
      return '적절하지 않은 엔티티입니다.';
    return this.repo.save(user);
  }
}
