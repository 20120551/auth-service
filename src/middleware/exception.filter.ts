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
        message: [
          exception.response.data.message ||
            exception.response.data.error_description ||
            exception.response.data.error ||
            'Internal server error',
        ],
        error: exception.response.data.error || exception.message,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        ...(exception.getResponse() as object),
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
