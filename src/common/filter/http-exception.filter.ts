import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from './api.exception';

/**
 * 统一处理异常的过滤器
 *  使用方式：
 *   throw new HttpException('您无权登录', HttpStatus.FORBIDDEN);
 *   throw new ApiException('用户不存在', ApiErrorCode.USER_NOTEXIST);
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // 判断 exception 是否在 APiException 原型链上决定调用 APiException 还是 HttpException
    if (exception instanceof ApiException) {
      return response.status(status).json({
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.getErrorMessage(),
        errorCode: exception.getErrorCode(),
      });
    }
    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
