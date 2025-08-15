/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  RoleBaseAccessControl,
  ROLES_KEY,
} from '@app/common/constant/index.constant';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

// Extend Express Request interface to include 'user'
declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Injectable()
export class RoleBaseAccessControlGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<
      RoleBaseAccessControl[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requireRoles) return true;
    const type = context.getType<'http' | 'rpc'>();
    let user: any = {};

    if (type === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const requestUser = request.user ?? {};
      user = requestUser;
    } else {
      const data = context.switchToRpc().getData();
      user = data?.user ?? {};
    }

    console.log('user', user);

    const userType = user?.payload?.user_type ?? user?.payload?.user?.user_type;

    const hasRole = requireRoles.includes(userType as RoleBaseAccessControl);
    if (!hasRole) {
      throw new ForbiddenException('You do not have access');
    }
    return true;
  }
}
