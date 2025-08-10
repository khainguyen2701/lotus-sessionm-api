import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type SortOrder = 'ASC' | 'DESC';

export type PagingConfig = {
  page?: number;
  size?: number;
  offSet?: number;
};

export const PagingDecorator = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const query: PagingConfig = request.query;
    const page = query.page ? Number(query.page) : 1;
    const size = query.size ? Number(query.size) : 10;
    return {
      page,
      size,
    };
  },
);
