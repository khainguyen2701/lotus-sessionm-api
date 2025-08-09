/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IS_PUBLIC_KEY } from '@app/common/decorators/public.decorator';
import { ExpiredSessionException } from '@app/common/httpCode/http.custom';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  [key: string]: any;
}

@Injectable()
export class HybridAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const contextType = context.getType<'http' | 'rpc'>();

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractToken(request.headers.authorization);
      const payload = await this.verifyToken(token);
      request['user'] = payload;
    }

    if (contextType === 'rpc') {
      const data = context
        .switchToRpc()
        .getData<{ authorization?: string; user?: JwtPayload }>();
      const token = this.extractToken(data.authorization);
      const payload = await this.verifyToken(token);
      data.user = payload;
    }

    return true;
  }

  private extractToken(authHeader?: string): string {
    const [type, token] = authHeader?.split(' ') ?? [];
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid token');
    return token;
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: process.env.SECRET_KEY_JWT,
      });
      return payload;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new ExpiredSessionException('Token has expired');
      }

      if (error?.name === 'JsonWebTokenError') {
        throw new BadRequestException('Token is invalid');
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
