import { HttpException } from '@nestjs/common';

export class ExpiredSessionException extends HttpException {
  constructor(message: string = 'Session has expired please login again') {
    super({ statusCode: 440, message, error: 'Expired Session' }, 440);
  }
}
