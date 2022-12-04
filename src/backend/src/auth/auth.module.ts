import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../services/prisma.service';
import { RedisService } from '../services/redis.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, RedisService],
})
export class AuthModule {}
