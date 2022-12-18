import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryNameDto } from './dto/update-repository.dto';
import { RepositoryQuery } from './dto/get-repository.dto';
import { User } from '@prisma/client';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() createRepositoryDto: CreateRepositoryDto,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.create(createRepositoryDto, user);
  }

  @Get()
  async findAllPublic(@Query() query: RepositoryQuery) {
    return await this.repositoryService.findAllPublicRepositories(query);
  }

  @Get('count')
  async getPublicRepositoriesCount() {
    return await this.repositoryService.getCountOfPublicRepositories();
  }

  @Get('user-repositories')
  async findAllUserRepositories(
    @Req() req: any,
    @Query() query: RepositoryQuery,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.findAllByUserId(user.id, query);
  }

  @Get('user-repositories/count')
  async getCountOfUserRepositories(@Req() req: any) {
    const user = req['user'] as User;
    return await this.repositoryService.getCountOfUserRepositories(user.id);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.findOne(id, user.id);
  }

  @Put(':id')
  async updateRepositoryName(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryNameDto,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.updateRepositoryName(
      id,
      updateRepositoryDto,
      user.id,
    );
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.remove(id, user.id);
  }

  @Get('private')
  async findAllPrivate(@Query() query: RepositoryQuery) {
    return await this.repositoryService.findAllPublicRepositories(query);
  }
}
