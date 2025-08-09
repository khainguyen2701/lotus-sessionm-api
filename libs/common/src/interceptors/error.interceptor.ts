/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
      catchError((err: any) => {
        // Nếu có lỗi xảy ra thì ném lại để filter xử lý
        return throwError(() => err);
      }),
    );
  }
}
