import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DarkpoolException } from '../exception/darkpool.exception';
import { Response } from './response.interface';

@Catch(DarkpoolException)
export class DarkpoolExceptionFilter implements ExceptionFilter {
  catch(exception: DarkpoolException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const responseBody: Response = {
      code: status,
      message: exception.message || 'Error occurred',
      data: null,
      error: exception.getResponse() || 'Unknown error',
    };

    response.status(status).json(responseBody);
  }
}