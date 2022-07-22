import { UsersService } from './users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

/*
  AuthService는 회원 인증과 관련된 서비스 로직을 작성합니다.
  예를 들어 회원가입시 이메일을 유니크하게 저장하고 싶다면,
  회원가입을 진행하기 전에 Database에서 같은 이메일이 존재하는 지
  먼저 체크를 하고 회원가입을 진행하도록 합니다.

  UsersService와 AuthService를 분리한 이유는 두 서비스의 역할이 서로 다르기 때문입니다.
*/
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 이메일 존재 여부 확인
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('이메일이 이미 존재합니다.');

    // 비밀번호 암호화
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    // 새로운 사용자 만들기
    const user = await this.usersService.create({ email, password: result });
    return user;
  }
  signin() {}
}
