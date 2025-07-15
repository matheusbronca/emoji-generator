import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

type HandleResType = {
  data: {
    emoji: string;
    browser: string;
  };
};

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<HandleResType> {
    return next.handle().pipe(
      map((data: HandleResType['data']) => {
        console.log('Interceptor: Transforming response');
        return { data };
      }),
    );
  }
}
