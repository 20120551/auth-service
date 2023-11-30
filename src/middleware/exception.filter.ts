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
          this._axiosError(exception.response.data, ['error', 'description']),
        ],
        error:
          exception.response.data.error ||
          exception.response.data.code ||
          exception.message,
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
  private _axiosError(data: any, errors: string[]) {
    let initValue = '';
    for (const error of errors) {
      if (data[initValue]) {
        return data[initValue];
      }

      if (data[error]) {
        return data[error];
      }

      if (!initValue) {
        initValue = error;
      }

      initValue = initValue + `_${data[error]}`;
    }

    return 'Internal server error';
  }
}
