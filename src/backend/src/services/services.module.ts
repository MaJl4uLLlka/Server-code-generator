import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { StripeService } from '../services/stripe.service';
import { RedisService } from './redis.service';

@Module({
  providers: [PrismaService, StripeService, RedisService],
  exports: [PrismaService, StripeService, RedisService],
})
export class ServicesModule {}
