import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // ✅ NestJS errors
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();

      message =
        (res as any)?.message || exception.message || 'Error occurred';
    }

    // ✅ PostgreSQL duplicate key error
    else if (exception?.code === '23505') {
      status = HttpStatus.BAD_REQUEST;

      // Extract field name
      const detail = exception?.detail || '';

      const match = detail.match(/\((.*?)\)/);
      const field = match ? match[1] : 'Field';

      message = `${field} already exists`;
    }

    // ✅ fallback
    else if (exception?.message) {
      message = exception.message;
    }

    response.status(status).json({
      status,
      message,
      data: [],
    });
  }
}