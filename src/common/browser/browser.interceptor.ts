import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class BrowserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const userAgent = request.headers?.['user-agent']?.split(' ')[0];
    const browserClient = userAgent ?? 'Unknown';

    request.headers['x-browser'] = browserClient;
    console.log(
      `Interceptor: manipulated request browser header: ${request.headers['x-browser']}`,
    );

    return next.handle();
  }
}
