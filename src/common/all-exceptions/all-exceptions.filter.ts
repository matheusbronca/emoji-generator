import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : 500;

    response.status(statusCode);
    response.json({
      message: isHttpException ? exception['message'] : 'Internal server error',
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
