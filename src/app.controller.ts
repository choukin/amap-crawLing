import { TaskService } from './task/task.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpCode,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Inject,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as multer from 'multer';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RedisService } from './redis/redis.service';
import { xhsLogin } from './crawLing/xhslogin';
import { xhsLoginQr } from './crawLing/loginQr';
import {
  yachAlarm,
  updateOrCreateNotes,
  updateOrCreateComment2,
} from './utils/api';
//import * as businessDistricts from '../商圈.json'
@Controller()
export class AppController {
  @Inject(RedisService)
  private redisService: RedisService;
  constructor(
    private readonly appService: AppService,
    private readonly taskService: TaskService,
    private readonly logger: Logger,
  ) {}

  // @Post()
  // @HttpCode(200)
  // @UseInterceptors(AnyFilesInterceptor())
  // async startCrawLing(@Body() body) {
  //   console.log(JSON.stringify(body));
  //   await createBot();
  //   return 'hello';
  // }

  @Get()
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(200)
  async startCrawLing(@Query() query) {
    // await this.taskService.handleSearchNotes();
    await this.taskService.handleSearchtBusinessDistrict();
    return 'hello';
  }
  @Get('qrLogin')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(200)
  async xhsQRLogin(@Query() query) {
    await xhsLoginQr();
  }

  @Get('clearCRAWLINGFlag')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(200)
  async clearCRAWLINGFlag(@Query() query) {
    await this.redisService.delCRAWLINGFlag();
    return { msg: '重置成功' };
  }

  @Get('test')
  async test() {
    // await this.taskService.handleHistoryNotes();
    // await this.taskService.handleCompetitor();
    // const [result, error] = await updateOrCreateNotes({
    //   title: '爬虫错误报警',
    //   content: '### 测试 爬虫错误报警 \n被拦截了请切换账户登录',
    // });
    // this.logger.error('缺少登录数据', AppController.name);
    // this.logger.log(result, AppController.name);
    // const commnets = [
    //   {
    //     subCommentHasMore: false,
    //     status: 0,
    //     liked: false,
    //     createTime: 1710232368000,
    //     atUsers: [],
    //     showTags: [],
    //     userInfo: {
    //       userId: '61c03c30000000001000f02e',
    //       nickname: '乐读',
    //       image:
    //         'https://sns-avatar-qc.xhscdn.com/avatar/6260f80b2d4b2d0001eb3303.jpg?imageView2/2/w/120/format/jpg',
    //     },
    //     subCommentCount: '1',
    //     subComments: [
    //       {
    //         id: '65f04542000000000700328e',
    //         noteId: '65ef015a000000001302538b',
    //         liked: false,
    //         showTags: ['is_author'],
    //         createTime: 1710245186000,
    //         status: 0,
    //         content: '好的哦，我问问我们班的辅导老师',
    //         atUsers: [],
    //         likeCount: '0',
    //         userInfo: {
    //           userId: '6029e3a4000000000101ddab',
    //           nickname: '卷毛日常',
    //           image:
    //             'https://sns-avatar-qc.xhscdn.com/avatar/65eef977d245081335eb7b58.jpg?imageView2/2/w/120/format/jpg',
    //         },
    //         targetComment: {
    //           id: '65f013300000000007001a14',
    //           userInfo: {
    //             nickname: '乐读',
    //             image:
    //               'https://sns-avatar-qc.xhscdn.com/avatar/6260f80b2d4b2d0001eb3303.jpg?imageView2/2/w/120/format/jpg',
    //             userId: '61c03c30000000001000f02e',
    //           },
    //         },
    //       },
    //     ],
    //     noteId: '65ef015a000000001302538b',
    //     content:
    //       '可以找乐读老师看一下是哪方面薄弱  让老师给一些专项的提升建议呢[偷笑R]',
    //     subCommentCursor: '65f04542000000000700328e',
    //     id: '65f013300000000007001a14',
    //     likeCount: '0',
    //     expended: false,
    //     hasMore: false,
    //   },
    //   {
    //     id: '660f4f00000000000500110e',
    //     subCommentCursor: '',
    //     subCommentHasMore: false,
    //     likeCount: '0',
    //     ipLocation: '辽宁',
    //     content: '英语S+这么难吗？我们数学是，我现在都退了，报的线下',
    //     atUsers: [],
    //     subCommentCount: '0',
    //     subComments: [],
    //     noteId: '65ef015a000000001302538b',
    //     status: 0,
    //     showTags: [],
    //     createTime: 1712279297000,
    //     liked: false,
    //     userInfo: {
    //       userId: '55706a44f5a263717f2039d9',
    //       nickname: 'Jinjin66',
    //       image:
    //         'https://sns-avatar-qc.xhscdn.com/avatar/62de736bcf46525febd50063.jpg?imageView2/2/w/120/format/jpg',
    //     },
    //     expended: false,
    //     hasMore: false,
    //   },
    //   {
    //     showTags: [],
    //     createTime: 1710668900000,
    //     subCommentCount: '0',
    //     content: '你去考个剑桥证书，可以凭证书入学吧？',
    //     subCommentHasMore: false,
    //     id: '65f6bc64000000000b0164fe',
    //     status: 0,
    //     atUsers: [],
    //     userInfo: {
    //       userId: '6405f68e000000001001d778',
    //       nickname: 'momo',
    //       image:
    //         'https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo3101s926els005p05uq743lrog9qtmho?imageView2/2/w/120/format/jpg',
    //     },
    //     noteId: '65ef015a000000001302538b',
    //     liked: false,
    //     likeCount: '0',
    //     ipLocation: '北京',
    //     subComments: [],
    //     subCommentCursor: '',
    //     expended: false,
    //     hasMore: false,
    //   },
    //   {
    //     content: '66%正确率只能A+班',
    //     createTime: 1710561909000,
    //     subComments: [],
    //     subCommentCursor: '',
    //     subCommentHasMore: false,
    //     atUsers: [],
    //     liked: false,
    //     userInfo: {
    //       userId: '60b8b8a60000000001008412',
    //       nickname: '🤓 🤓',
    //       image:
    //         'https://sns-avatar-qc.xhscdn.com/avatar/60b8b8a60000000001008412.jpg?imageView2/2/w/120/format/jpg',
    //     },
    //     showTags: [],
    //     noteId: '65ef015a000000001302538b',
    //     subCommentCount: '0',
    //     id: '65f51a750000000006025206',
    //     status: 0,
    //     likeCount: '1',
    //     ipLocation: '四川',
    //     expended: false,
    //     hasMore: false,
    //   },
    // ];
    // console.log(`🚀 ~ AppController ~ test ~ commnets:`, commnets);
    // await updateOrCreateComment2(commnets);
  }
}
