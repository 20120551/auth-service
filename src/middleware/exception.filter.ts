import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AxiosError) {
      const status = exception.response.status;
      return response.status(status).json({
        statusCode: status,
        message:
          exception.response.data.error_description ||
          exception.response.data.error ||
          exception.response.data.description ||
          'Internal server error',
        error:
          exception.response.data.error ||
          exception.response.data.code ||
          exception.message,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json({
        message: typeof res === 'string' ? res : res['message'],
        error: exception.message,
      });
    } else {
      return response.status(500).json({
        statusCode: 500,
        error: exception.message,
        message: 'Internal server error',
      });
    }
  }
}
