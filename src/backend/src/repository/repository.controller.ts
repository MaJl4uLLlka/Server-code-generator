import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryNameDto } from './dto/update-repository.dto';
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
  async findAll() {
    return await this.repositoryService.findAllPublicRepositories();
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
}
