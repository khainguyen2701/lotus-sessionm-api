import { HttpException } from '@nestjs/common';

export class ExpiredSessionException extends HttpException {
  constructor(message: string = 'Session has expired please login again') {
    super({ statusCode: 440, message, error: 'Expired Session' }, 440);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(message: string = 'User with this email already exists') {
    super({ statusCode: 409, message, error: 'User Already Exists' }, 409);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message: string = 'User not found') {
    super({ statusCode: 404, message, error: 'User Not Found' }, 404);
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor(message: string = 'Invalid email or password') {
    super({ statusCode: 401, message, error: 'Invalid Credentials' }, 401);
  }
}

export class DatabaseTransactionException extends HttpException {
  constructor(message: string = 'Database transaction failed') {
    super(
      { statusCode: 500, message, error: 'Database Transaction Error' },
      500,
    );
  }
}
