import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { authTokenExpiresIn } from '../config/constants';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: RedisClientType;
  async onModuleInit() {
    this.redisClient = createClient({ url: process.env.REDIS_URL });

    this.redisClient.on('error', (err) => {
      console.log('Redis: Something went wrong ' + err);
      throw new Error(err);
    });

    await this.redisClient.connect();
    console.log('Redis: successfully connected');
  }

  async set(key: string, value: any, expiresAt: number = authTokenExpiresIn) {
    await this.redisClient.set(key, JSON.stringify(value), {
      EX: expiresAt,
      NX: true,
    });
  }

  async get(key: string) {
    const value = await this.redisClient.get(key);

    return value && JSON.parse(value);
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }
}
