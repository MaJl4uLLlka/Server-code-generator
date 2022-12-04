import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import * as nanoid from 'nanoid';
import { UserService } from '../user/user.service';
import * as hashUtil from '../utils/hash';
import { authTokenLength } from '../config/constants';
import { RedisService } from '../services/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    const isMatch = await hashUtil.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Passwords not match');
    }

    const token = nanoid(authTokenLength);
    await this.redisService.set(token, { id: user.id });

    return { token: token };
  }
}
