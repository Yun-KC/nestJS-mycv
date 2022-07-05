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

    /* 
      user 객체는 user.email = "test@test.com" 으로 필드값을 변경할 수 있다.
      user Entity에 모든 필드를 private로 변경하면
      this.repo.create에서 오류가 발생한다.
      왜? entity의 필드 값은 private가 아닐까?
      https://stackoverflow.com/questions/51860432/typeorm-repository-create-not-setting-values
    */

    /*
      this.repo.insert(user);
      insert와 save의 차이점은 뭘까?
      insert는 단일 엔티티를 저장하는 반면
      save는 영향을 받는 모든 테이블에 보류중인 모든 엔티티를 삽입한다.
      
      typeORM logging를 살펴보면
      save의 경우 하나의 트랜잭션으로 INSERT INTO를 감싸 실행하지만
      insert는 단순한 INSERT INTO 명령을 실행한다.
    */

    return this.repo.save(user);
  }

  findOne(id: number) {
    // 하나의 레코드 또는 null을 리턴
    return this.repo.findOne({ where: { id } });
  }

  find(email: string) {
    // 여러개의 레코드를 배열로 리턴 또는  찾는 사용자가 없을 경우 빈 배열을 리턴
    return this.repo.find({ where: { email } });
  }
}
