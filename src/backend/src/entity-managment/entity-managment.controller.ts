import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { EntityManagmentService } from './entity-managment.service';
import {
  CreateEntityManagmentDto,
  CreateLinkDto,
} from './dto/create-entity-managment.dto';
import { UpdateEntityManagmentDto } from './dto/update-entity-managment.dto';

@Controller('entity-managment')
export class EntityManagmentController {
  constructor(
    private readonly entityManagmentService: EntityManagmentService,
  ) {}

  @Post(':repositoryId')
  async create(
    @Body() createEntityManagmentDto: CreateEntityManagmentDto,
    @Param('repositoryId') repositoryId: string,
  ) {
    return await this.entityManagmentService.create(
      repositoryId,
      createEntityManagmentDto,
    );
  }

  @Post(':repositoryId/create-link')
  async createLink(
    @Body() createLinkDto: CreateLinkDto,
    @Param('repositoryId') repositoryId: string,
  ) {
    return await this.entityManagmentService.createLink(createLinkDto);
  }

  @Get(':repositoryId')
  async findAll(@Param('repositoryId') repositoryId: string) {
    return await this.entityManagmentService.findAll(repositoryId);
  }

  @Get(':repositoryId/:id')
  async findOne(
    @Param('repositoryId') repositoryId: string,
    @Param('id') id: string,
  ) {
    return await this.entityManagmentService.findOne(repositoryId, id);
  }

  @Put(':repositoryId/:id')
  async update(
    @Param('repositoryId') repositoryId: string,
    @Param('id') id: string,
    @Body() updateEntityManagmentDto: UpdateEntityManagmentDto,
  ) {
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
