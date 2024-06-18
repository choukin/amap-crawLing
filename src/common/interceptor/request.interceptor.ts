/*
https://docs.nestjs.com/interceptors#interceptors
*/
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const log = new Logger('bootstrap');
let requestSeq = 0;

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now(); // 请求开始时间
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    const seq = requestSeq++;
    const urlInfo = `${request.method} ${request.url}`;
    log.log(`[${seq}]==> ${urlInfo}`);
    return next
      .handle()
      .pipe(
        tap(() => log.log(`[${seq}]<== ${urlInfo} ${Date.now() - start} ms`)),
      );
  }
}
