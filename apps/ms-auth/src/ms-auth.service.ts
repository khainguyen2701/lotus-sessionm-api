/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthSignInDTO, AuthSignUpDTO } from './dto/auth.dto';
import { RefreshTokenClassDto } from './dto/token.dto';
import { AuthRepository } from './repositories/auth.repository';
import { ExpiredSessionException } from '@app/common/httpCode/http.custom';
import {
  AuthMemberSignInDTO,
  AuthMemberSignUpDTO,
} from '@app/common/dto/ms-auth/auth-member.dto';
import { AccountsEntity, UsersEntity } from '@app/database';

@Injectable()
export class MsAuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
  ) {}

  // Sign in member portal
  /**
   * Sign in member portal
   * @param body - AuthMemberSignInDTO
   * @returns Promise<{ access_token: string; user_id: string; refresh_token: string } | undefined>
   */
  async signIn(
    body: AuthMemberSignInDTO,
  ): Promise<
    { access_token: string; user_id: string; refresh_token: string } | undefined
  > {
    try {
      const { password, email } = body;
      if (!password || !email) {
        throw new UnauthorizedException('Missing email or password');
      }
      const account = await this.authRepo.findAccountByEmail(email);
      if (!account || Object.keys(account)?.length === 0) {
        throw new BadRequestException('Username or password not match');
      }
      const isMatchPassword = await compare(password, account.password);
      if (!isMatchPassword)
        throw new BadRequestException('Password is not match');

      const accessToken = await this.jwtService.signAsync(
        { payload: account.user },
        { secret: process.env.SECRET_KEY_JWT, expiresIn: '7d' },
      );
      const refreshToken = await this.jwtService.signAsync(
        { payload: account.user },
        { secret: process.env.SECRET_KEY_JWT, expiresIn: '14d' },
      );
      return {
        access_token: accessToken,
        user_id: account.user.id,
        refresh_token: refreshToken,
      };
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : 'Unauthorized';
      throw new UnauthorizedException(message);
    }
  }

  //Sign up member portal
  /**
   * Sign up member portal
   * @param body - AuthMemberSignUpDTO
   * @returns Promise<{
   *   user_id: string;
   *   account_id: string;
   *   user: Partial<UsersEntity>;
   *   access_token: string;
   * }>
   */
  async signUpMemberPortal(body: AuthMemberSignUpDTO): Promise<{
    user_id: string;
    account_id: string;
    user: Partial<UsersEntity>;
    access_token: string;
  }> {
    const user = await this.authRepo.signUpMemberPortal(body);
    const access_token = await this.jwtService.signAsync(
      { payload: user },
      { secret: process.env.SECRET_KEY_JWT, expiresIn: '1m' },
    );
    return {
      ...user,
      access_token,
    };
  }

  // async refreshToken(
  //   body: RefreshTokenClassDto,
  // ): Promise<{ access_token: string; refresh_token: string }> {
  //   try {
  //     const { refresh_token } = body;
  //     const payload: Record<string, unknown> =
  //       await this.jwtService.verifyAsync(refresh_token, {
  //         secret: process.env.SECRET_KEY_JWT,
  //       });
  //     const { exp, iat, ...rest } = payload;
  //     const accessToken = await this.jwtService.signAsync(rest, {
  //       secret: process.env.SECRET_KEY_JWT,
  //       expiresIn: '7 days',
  //     });
  //     const refreshToken = await this.jwtService.signAsync(rest as object, {
  //       secret: process.env.SECRET_KEY_JWT,
  //       expiresIn: '7 days',
  //     });
  //     return { access_token: accessToken, refresh_token: refreshToken };
  //   } catch (error: any) {
  //     if (error?.name === 'TokenExpiredError') {
  //       throw new ExpiredSessionException('Refresh token has expired');
  //     }
  //     if (error?.name === 'JsonWebTokenError') {
  //       throw new BadRequestException('Token is invalid');
  //     }
  //     throw new UnauthorizedException('Invalid Token');
  //   }
  // }
}
