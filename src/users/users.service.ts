import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (resultForValidateUserEntity.length !== 0) return '적절하지 않은 엔티티입니다.';

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

  async findOne(id: number) {
    /* 
    하나의 레코드 또는 찾는 레코드가 없다면 예외 처리를 한다.
    findOne 메서드를 사용하는 remove, update 메서드 에서는 
    user 결과에 대한 익셉션을 중복으로 발생시킬 이유가 있을까?
    
    */
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');
    return user;
  }

  find(email: string) {
    // 여러개의 레코드를 배열로 리턴 또는  찾는 사용자가 없을 경우 빈 배열을 리턴
    return this.repo.find({ where: { email } });
  }
  async update(id: number, attrs: Partial<User>) {
    // https://kyounghwan01.github.io/blog/TS/fundamentals/utility-types
    // Partial은 특정 타입의 부분 집합을 만족하는 타입을 정의할 수 있습니다.
    const user = await this.findOne(id);
    // if (!user) throw new Error('유저를 찾을 수 없습니다.');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    // if (!user) throw new Error('유저를 찾을 수 없습니다.');

    // remove(Entity가 필요), delete({where:{id}}) Entity 필요 X;
    // remove는 Entity에 적용된 Hooks를 호출함, delete는 호출하지 않음
    return this.repo.remove(user);
  }
}
