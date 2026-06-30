import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const rawResponse = isHttpException ? exception.getResponse() : null;
    const message = typeof rawResponse === 'object' && rawResponse && 'message' in rawResponse ? (rawResponse as { message: unknown }).message : isHttpException ? exception.message : 'Internal server error';

    response.status(status).json({
      ok: false,
      error: {
        statusCode: status,
        code: status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_REJECTED',
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
