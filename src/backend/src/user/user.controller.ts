import { Controller, Get, Post, Body, Put, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findOne(@Req() req: any) {
    const user = req['user'] as User;
    return await this.userService.findOne(user.id);
  }

  @Put()
  async update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'] as User;
    return await this.userService.update(user.id, updateUserDto);
  }
}
