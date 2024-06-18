import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestInterceptor } from './common/interceptor/request.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
// import './utils/enviroment';

const port = process.env.PORT || 3003;
// console.log(`🚀 ~ process.env.PORT :`, process.env.PORT);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.PREFIX || 'amap');
  // 修改默认的 HTTP 状态码为 200 Conflict
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 统计请求时间过滤器
  app.useGlobalInterceptors(new RequestInterceptor());
  // 统一异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 拦截器统一处理数据格式
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
  const logger = new Logger('bootstrap');
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
    logger.log(`http://127.0.0.1:${port}/${process.env.PREFIX}`);
  } else {
    logger.log(`https://bot-test.ledupeiyou.com/${process.env.PREFIX}`);
  }
}
bootstrap();
