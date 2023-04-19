import { Injectable } from '@nestjs/common';
import {
  CreateEntityManagmentDto,
  CreateLinkDto,
} from './dto/create-entity-managment.dto';
import { UpdateEntityManagmentDto } from './dto/update-entity-managment.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class EntityManagmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    repositoryId: string,
    createEntityManagmentDto: CreateEntityManagmentDto,
  ) {
    return await this.prismaService.entity.create({
      data: {
        name: createEntityManagmentDto.name.trim(),
        schema: createEntityManagmentDto.schema,
        repositoryId,
        service: {
          create: {
            name: createEntityManagmentDto.name.trim(),
            repositoryId: repositoryId,
            controller: {
              create: {
                name: createEntityManagmentDto.name.trim(),
                repositoryId: repositoryId,
              },
            },
          },
        },
      },
    });
  }

  async createLink(createLinkDto: CreateLinkDto) {
    return await this.prismaService.link.create({
      data: {
        fromEntityId: createLinkDto.from,
        toEntityId: createLinkDto.to,
        linkType: createLinkDto.linkType,
      },
    });
  }

  async findAll(repositoryId: string) {
    return await this.prismaService.entity.findMany({
      where: {
        repositoryId: repositoryId,
      },
    });
  }

  async findOne(repositoryId: string, entityId: string) {
    return await this.prismaService.entity.findFirst({
      where: {
        repositoryId: repositoryId,
        id: entityId,
      },
    });
  }

  async update(
    repositoryId: string,
    entityId: string,
    updateEntityManagmentDto: UpdateEntityManagmentDto,
  ) {
    return await this.prismaService.entity.update({
      where: {
        id: entityId,
      },
      data: {
        ...updateEntityManagmentDto,
      },
    });
  }

  async remove(entityId: string) {
    return await this.prismaService.entity.delete({
      where: {
        id: entityId,
      },
    });
  }
}
