import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { RedisService } from '../services/redis.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.header(process.env.APP_AUTH_HEADER_NAME);

    if (!token) {
      throw new BadRequestException(
        `Authorization header is not valid ${token}`,
      );
    }

    const userData = await this.redisService.get(token);

    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    const userId = userData['id'] as string;
    const user = this.userService.findOne(userId);
    req['user'] = user;
    next();
  }
}
