import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LangDecorator = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const lang = request.headers['x-lang-key'];
    return lang || 'en';
  },
);
