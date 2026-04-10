import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any)?.message || res;
      if (Array.isArray(message)) message = message[0];
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = (exception as any)?.message || 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}