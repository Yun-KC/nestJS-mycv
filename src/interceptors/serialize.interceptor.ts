import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// 기본적으로 모든 클래스를 의미하는 인터페이스
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}

/*
인터셉터는 요청과 응답을 가로채서 변형을 가할 수 있는 컴포넌트입니다.

메서드 실행 전/후 추가 로직 바인딩
함수에서 반환된 결과를 변환
함수에서 던져진 예외를 변환
기본 기능의 동작을 확장
특정 조건에 따라 기능을 완전히 재정의(예: 캐싱)
 */
