import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import type { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = "Internal server error";

    if (exception instanceof HttpException) {

      status = exception.getStatus();
      const res = exception.getResponse();

      message =
        typeof res === "string"
          ? res
          : (res as any).message || message;

    } else if (exception instanceof Error) {

      message = exception.message;

    }

    response.status(status).json({
      statusCode: status,
      message,
      data: [],
    });

  }

}