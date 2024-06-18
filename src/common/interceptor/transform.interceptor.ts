import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * 返回格式化返回数据拦截器
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const host = context.switchToHttp();

        const request = host.getRequest<Request>();
        const method = request.method;
        const url = request.url;
        // 需要特殊处理的接口路径
        if (method === 'GET' && url.startsWith('/xiaole/tal?')) {
          return data;
        }
        // TODO： 可能会有风险
        if (data?.hasOwnProperty('msgtype')) {
          return data;
        } else {
          return { code: 200, data, message: '请求成功' };
        }
      }),
    );
  }
}
