import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserIdDecorator = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // Lấy từ header x-user-id trước
    const userIdFromHeader = request.headers['x-user-id'];
    if (userIdFromHeader) {
      return userIdFromHeader;
    }

    return null;
  },
);
