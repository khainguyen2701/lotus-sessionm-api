/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch() // Bắt tất cả các loại ngoại lệ
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      // Xử lý các HttpException chuẩn của NestJS
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || message;
      errorCode = (errorResponse as any).code || exception.name;
    } else if (exception instanceof RpcException) {
      const error = exception.getError();
      if (typeof error === 'object' && error !== null) {
        status = (error as any).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        message = (error as any).message || message;
        errorCode = (error as any).code || 'RPC_ERROR';
      } else {
        message = String(error);
        errorCode = 'RPC_ERROR';
      }
    } else {
      // Xử lý các lỗi không xác định
      console.error(exception); // Ghi log lỗi không mong muốn
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      code: errorCode, // Mã lỗi tùy chỉnh để dễ dàng phân loại
    });
  }
}
