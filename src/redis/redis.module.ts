import { Module, Global, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    Logger,
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          url: 'redis://:uXQKOZLWx5SqP9y@10.129.252.136:6379/13',
        });
        try {
          await client.connect();
          console.log('Connected to Redis');
        } catch (error) {
          console.error('Connected to Redis');
        }

        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
