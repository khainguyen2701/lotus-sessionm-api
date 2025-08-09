/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

interface ResponseApi<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
  status: 'success' | 'client_error' | 'server_error' | 'unknown';
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<unknown, ResponseApi<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseApi<T>> {
    const now = new Date().toISOString();
    const type = context.getType<'http' | 'rpc'>();

    let path = 'unknown';
    let statusCode = 200;

    if (type === 'http') {
      const http = context.switchToHttp();
      const req = http.getRequest<Request>();
      const res = http.getResponse<Response>();
      path = req.url;
      statusCode = res.statusCode || 200;
    } else {
      const rpc = context.switchToRpc().getData<{ cmd?: string }>();
      path = rpc?.cmd && typeof rpc.cmd === 'string' ? rpc.cmd : 'rpc_method';
      statusCode = 200;
    }

    const status = this.getStatus(statusCode);

    return next.handle().pipe(
      map((data: any) => {
        if (this.isResponseApi<T>(data)) {
          return data;
        }

        if (type === 'http') {
          context.switchToHttp().getResponse<Response>().status(statusCode);
        }

        return {
          data: data?.data as any,
          statusCode,
          timestamp: now,
          path,
          status,
        };
      }),
    );
  }

  private getStatus(
    statusCode: number,
  ): 'success' | 'client_error' | 'server_error' | 'unknown' {
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 400 && statusCode < 500) return 'client_error';
    if (statusCode >= 500) return 'server_error';
    return 'unknown';
  }

  private isResponseApi<T>(data: unknown): data is ResponseApi<T> {
    return (
      !!data &&
      typeof data === 'object' &&
      'data' in data &&
      'statusCode' in data &&
      'timestamp' in data &&
      'path' in data &&
      'status' in data
    );
  }
}
