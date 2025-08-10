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

@Injectable()
export class MsAuthService {
  // constructor(
  //   private authRepo: AuthRepository,
  //   private jwtService: JwtService,
  // ) {}
  // async signIn(
  //   body: AuthSignInDTO,
  // ): Promise<{ access_token: string; refresh_token: string } | undefined> {
  //   try {
  //     const { password, username } = body;
  //     if (!password || !username) {
  //       throw new UnauthorizedException('Missing username or password');
  //     }
  //     const user = await this.authRepo.findOneByUserName({ username });
  //     if (!user || Object.keys(user)?.length === 0) {
  //       throw new BadRequestException('Username or password not match');
  //     }
  //     const isMatchPassword = await compare(password, user.password);
  //     if (!isMatchPassword)
  //       throw new BadRequestException('Password is not match');
  //     const { password: has_password, ...rest } = user;
  //     const accessToken = await this.jwtService.signAsync(
  //       { payload: rest },
  //       { secret: process.env.SECRET_KEY_JWT, expiresIn: '1m' },
  //     );
  //     const refreshToken = await this.jwtService.signAsync(
  //       { payload: rest },
  //       { secret: process.env.SECRET_KEY_JWT, expiresIn: '1h' },
  //     );
  //     return { access_token: accessToken, refresh_token: refreshToken };
  //   } catch (error: unknown) {
  //     const message =
  //       typeof error === 'object' && error !== null && 'message' in error
  //         ? (error as { message?: string }).message
  //         : 'Unauthorized';
  //     throw new UnauthorizedException(message);
  //   }
  // }
  // async signUp(body: AuthSignUpDTO): Promise<{ id: string }> {
  //   return await this.authRepo.signUp(body);
  // }
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
