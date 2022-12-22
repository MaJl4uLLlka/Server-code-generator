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
  Res,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import {
  UpdateRepositoryNameDto,
  ShareRepositoryDto,
} from './dto/update-repository.dto';
import { RepositoryQuery, RepositoryFilter } from './dto/get-repository.dto';
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

  @Get('public/all')
  async findAllPublic(@Query() query: RepositoryQuery) {
    return await this.repositoryService.findAllPublicRepositories(query);
  }

  @Get('public/count')
  async getPublicRepositoriesCount(
    @Query() repositoryFilter: RepositoryFilter,
  ) {
    return await this.repositoryService.getCountOfPublicRepositories(
      repositoryFilter.filter,
    );
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
  async getCountOfUserRepositories(
    @Req() req: any,
    @Query() repositoriesFilter: RepositoryFilter,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.getCountOfUserRepositories(
      user.id,
      repositoriesFilter.filter,
    );
  }

  @Get('private/count')
  async getPrivateRepositoriesCount(
    @Req() req: any,
    @Query() repositoryFilter: RepositoryFilter,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.getCountOfPrivateRepositories(
      user.id,
      repositoryFilter.filter,
    );
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.findOne(id, user.id);
  }

  @Post(':id/share')
  async shareWithUser(
    @Req() req: any,
    @Param('id') id: string,
    @Body() userData: ShareRepositoryDto,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.shareRepositoryToUser(
      id,
      user.id,
      userData.nick,
    );
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

  @Get('private/available')
  async findAllPrivate(@Req() req: any, @Query() query: RepositoryQuery) {
    const user = req['user'] as User;
    return await this.repositoryService.findAllPrivateAvilable(user.id, query);
  }

  // @Get(':id/fill')
  // async getPreparedCode(@Res() res) {
  //   return await this.repositoryService.
  // }
}
