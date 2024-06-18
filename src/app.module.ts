/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheModule, Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import './utils/enviroment';
// console.log(process.env);

import { TaskService } from './task/task.service';
import { RedisModule } from './redis/redis.module';

const appname = 'wechatbot-api';
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(appname, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        // 日志切割，可以按照时间切割日志，方便后期检查日志
        // 会依次生成2024-02-01.log、2024-02-02.log
        new DailyRotateFile({
          level: 'info',
          filename: `logs/info-${appname}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new DailyRotateFile({
          level: 'error',
          filename: `logs/error-${appname}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    // mongodb://username:password@host:port/database
    // MongooseModule.forRoot(
    //   'mongodb://yachbot_rw:LTAI5t8GT46LrHm@10.129.252.238:27017/yach-bot?socketTimeoutMS=5000&authSource=admin',
    // ),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       uri: configService.get('MONGOOSE_URL'),
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    ScheduleModule.forRoot(),
    HttpModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, TaskService],
})
export class AppModule {}
