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
import { EntityManagmentService } from './entity-managment.service';
import {
  CreateEntityManagmentDto,
  CreateLinkDto,
} from './dto/create-entity-managment.dto';
import { UpdateEntityManagmentDto } from './dto/update-entity-managment.dto';
import { User } from '@prisma/client';

@Controller('entity-managment')
export class EntityManagmentController {
  constructor(
    private readonly entityManagmentService: EntityManagmentService,
  ) {}

  @Post(':repositoryId')
  async create(
    @Req() req: any,
    @Body() createEntityManagmentDto: CreateEntityManagmentDto,
    @Param('repositoryId') repositoryId: string,
  ) {
    const user = req.user as User;
    await this.entityManagmentService.validateEntityData(
      repositoryId,
      createEntityManagmentDto,
    );

    return await this.entityManagmentService.create(
      user,
      repositoryId,
      createEntityManagmentDto,
    );
  }

  @Post(':repositoryId/create-link')
  async createLink(
    @Req() req: any,
    @Body() createLinkDto: CreateLinkDto,
    @Param('repositoryId') repositoryId: string,
  ) {
    const user = req.user as User;
    return await this.entityManagmentService.createLink(
      user,
      repositoryId,
      createLinkDto,
    );
  }

  @Get(':repositoryId')
  async findAll(@Req() req: any, @Param('repositoryId') repositoryId: string) {
    const user = req.user as User;
    return await this.entityManagmentService.findAll(user, repositoryId);
  }

  @Get(':repositoryId/:id')
  async findOne(
    @Req() req: any,
    @Param('repositoryId') repositoryId: string,
    @Param('id') id: string,
  ) {
    const user = req.user as User;
    return await this.entityManagmentService.findOne(user, repositoryId, id);
  }

  @Put(':repositoryId/:id')
  async update(
    @Param('repositoryId') repositoryId: string,
    @Param('id') id: string,
    @Body() updateEntityManagmentDto: UpdateEntityManagmentDto,
  ) {
    await this.entityManagmentService.validateUpdateEntityData(
      repositoryId,
      id,
      updateEntityManagmentDto,
    );

    return await this.entityManagmentService.update(
      repositoryId,
      id,
      updateEntityManagmentDto,
    );
  }

  @Delete(':repositoryId/:id')
  async remove(
    @Param('repositoryId') repositoryId: string,
    @Param('id') id: string,
  ) {
    return await this.entityManagmentService.remove(id);
  }
}
