import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Si la respuesta es un objeto (errores de validación), extraer el mensaje
    const message = typeof exceptionResponse === 'object' && exceptionResponse !== null
      ? (exceptionResponse as any).message || exception.message
      : exception.message;

    response
      .status(status)
      .json({
        status: 'error',
        error: exception.name,
        statusCode: status,
        message: message,
        timestamp: new Date().toLocaleString(),
        path: request.url,
      });
  }
}