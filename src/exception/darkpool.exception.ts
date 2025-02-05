import { HttpException, HttpStatus } from '@nestjs/common';

export class DarkpoolException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}