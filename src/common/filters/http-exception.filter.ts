import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException
      ? exception.getResponse()
      : exception;

    this.logger.error(`Http Status ${status} Error Message: ${JSON.stringify(message)}`)

    response
      .status(status)
      .json({
        timestamps: new Date().toISOString(),
        path: request.url,
        error: message
      })
  }
}