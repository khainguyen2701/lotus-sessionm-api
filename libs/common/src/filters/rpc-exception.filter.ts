/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctxType = host.getType();

    if (ctxType === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : exception?.message?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : exception?.message?.message ||
            exception?.message ||
            'Internal Error';

      response.status(status).json({
        success: false,
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      });
    } else if (ctxType === 'rpc') {
      throw exception; // Để Nest tự bắn lại lỗi về caller (Gateway)
    }
  }
}
