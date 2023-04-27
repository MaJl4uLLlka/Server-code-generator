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
  Header,
  Res,
  StreamableFile,
  BadRequestException,
} from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { RepositoryQuery } from './dto/get-repository.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('repositories')
export class RepositoryController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly subsciptionService: SubscriptionService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() createRepositoryDto: CreateRepositoryDto,
  ) {
    const user = req['user'] as User;
    let subscription: any;
    try {
      subscription = await this.subsciptionService.getSubscription(
        user.stripeAccountId,
      );
    } catch (err) {}

    if (!subscription && createRepositoryDto.type === 'JSON_RPC') {
      throw new BadRequestException(
        'To create a JSON-RPC project need subscription',
      );
    }

    return await this.repositoryService.create(createRepositoryDto, user);
  }

  @Get('user-repositories')
  async findAllUserRepositories(
    @Req() req: any,
    @Query() query: RepositoryQuery,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.findAllByUserId(user.id, query);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.findOne(id, user.id);
  }

  @Put(':id')
  async updateRepository(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ) {
    const user = req['user'] as User;
    return await this.repositoryService.updateRepository(
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

  @Get('is-user-owner/:id')
  async isUserRepositoryOwner(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.isUserRepositoryOwner(id, user.id);
  }

  @Get(':repositoryId/download')
  async downloadCode(
    @Req() req: any,
    @Res() res: Response,
    @Param('repositoryId') repositoryId: string,
  ) {
    try {
      const user = req.user as User;
      const repository = await this.repositoryService.findOne(
        repositoryId,
        user.id,
      );
      const buffer = await this.repositoryService.prepareArchive(repositoryId);

      res.set({
        'Content-Length': buffer.length,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${repository.name}.zip`,
      });

      res.send(buffer);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/entities')
  async getAllEntities(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.getRepositoryEntities(id);
  }

  @Get(':id/services')
  async getAllServices(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.getRepositoryServices(id);
  }

  @Get(':id/controllers')
  async getAllControllers(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.getRepositoryControllers(id);
  }

  @Get(':id/links')
  async getAllLinks(@Req() req: any, @Param('id') id: string) {
    const user = req['user'] as User;
    return await this.repositoryService.getAllLinks(id);
  }
}
