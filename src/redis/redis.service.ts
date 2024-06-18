import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

const YACH_TOKEN = 'YACH_TOKEN';
const GPT_TOKEN = 'GPT_TOKEN';

const CRAWLING = 'CRAWLING';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly httpService: HttpService,
  ) {}

  async get(key: string) {
    const data = await this.redisClient.get(key);

    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  async set(key: string, value: string, seconds?: number) {
    let resultSet = '';
    if (!seconds) {
      resultSet = await this.redisClient.set(key, value);
    } else {
      resultSet = await this.redisClient.set(key, value, {
        EX: seconds ? seconds : 0, // 过期时间
        NX: true, // 只有当 key 不存在时才设置
      });
    }
    return resultSet === 'OK';
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }

  /**
   * 设置知音楼 token
   * @param token
   * @returns
   */
  async setYachtoken(token: string, expired_time: number) {
    return await this.set(YACH_TOKEN, token, expired_time);
  }
  async getYachtoken() {
    const token = await this.get(YACH_TOKEN);
    if (!token) {
      const appkey = this.configService.get('YACH_APPKEY');
      const appsecret = this.configService.get('YACH_APPSECRET');
      const yachHost = this.configService.get('YACH_HOST');
      const result = await this.httpService.axiosRef.get(
        `${yachHost}/gettoken?appkey=${appkey}&appsecret=${appsecret}`,
      );
      const { access_token: token, expired_time } = result.data.obj;
      this.logger.log(result.data, RedisService.name + `知音楼接口获取数据`);
      this.setYachtoken(token, 7200);
      return token;
    }
    this.logger.log(token, RedisService.name + `缓存中的 token`);
    return token;
  }

  /**
   * 设置 GPT TOKEN
   * @param token
   * @returns
   */
  async setGPTtoken(token: string, expired_time: number) {
    return await this.set(GPT_TOKEN, token, expired_time);
  }

  /**
   * 获取 GPT TOKEN
   * @returns
   */
  async getGPTtoken() {
    const token = await this.get(GPT_TOKEN);
    if (!token) {
      const appid = this.configService.get('GPT_APPID');
      const secret = this.configService.get('GPT_SECRET');
      const gptHost = this.configService.get('GPT_HOST');
      const result = await this.httpService.axiosRef.get(
        `${gptHost}/get_token`,
        {
          params: {
            appid,
            secret,
          },
        },
      );
      this.logger.log(result.data, RedisService.name + `乐读 GPT接口获取数据`);
      const { access_token, expire } = result.data;
      this.setGPTtoken(access_token, 3600);
      return access_token;
    }
    return token;
  }

  /**
   * 设置爬取中状态
   * @param flag
   * @returns
   */
  async setCRAWLINGFlag(flag: string) {
    return await this.set(CRAWLING, flag);
  }

  /**
   * 获取当前状态是否爬取中
   * @returns
   */
  async getCRAWLINGFlag() {
    const flag = await this.get(CRAWLING);
    console.log(`🚀 ~ RedisService ~ getCRAWLINGFlag ~ flag:`, flag);
    if (!flag) {
      return false;
    }
    return true;
  }
  /**
   * 删除爬取中状态，表示没有在爬取
   */
  async delCRAWLINGFlag() {
    await this.del(CRAWLING);
  }
}
