import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateEntityManagmentDto,
  CreateLinkDto,
} from './dto/create-entity-managment.dto';
import { UpdateEntityManagmentDto } from './dto/update-entity-managment.dto';
import { PrismaService } from '../services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class EntityManagmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: User,
    repositoryId: string,
    createEntityManagmentDto: CreateEntityManagmentDto,
  ) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (repository.userId !== user.id) {
      throw new BadRequestException('Permission denied');
    }

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

  async createLink(
    user: User,
    repositoryId: string,
    createLinkDto: CreateLinkDto,
  ) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (repository.userId !== user.id) {
      throw new BadRequestException('Permission denied');
    }

    const sameLink = await this.prismaService.link.findFirst({
      where: {
        OR: [
          {
            linkType: createLinkDto.linkType,
            fromEntityId: createLinkDto.from,
            toEntityId: createLinkDto.to,
          },
          {
            linkType: createLinkDto.linkType,
            fromEntityId: createLinkDto.to,
            toEntityId: createLinkDto.from,
          },
        ],
      },
    });

    if (sameLink) {
      throw new BadRequestException('Link exists');
    }

    return await this.prismaService.link.create({
      data: {
        fromEntityId: createLinkDto.from,
        toEntityId: createLinkDto.to,
        linkType: createLinkDto.linkType,
      },
    });
  }

  async findAll(user: User, repositoryId: string) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (repository.userId !== user.id) {
      throw new BadRequestException('Permission denied');
    }
    return await this.prismaService.entity.findMany({
      where: {
        repositoryId: repositoryId,
      },
    });
  }

  async findOne(user: User, repositoryId: string, entityId: string) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (repository.userId !== user.id) {
      throw new BadRequestException('Permission denied');
    }
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

  async validateEntityData(
    repositoryId: string,
    data: CreateEntityManagmentDto,
  ) {
    const entitiesWithSameNames = await this.prismaService.entity.findMany({
      where: {
        AND: [{ repositoryId: repositoryId }, { name: data.name }],
      },
    });

    if (entitiesWithSameNames.length !== 0) {
      throw new BadRequestException(
        'You already have an entity with this name',
      );
    }

    const schema: Array<any> = JSON.parse(data.schema);

    if (schema.length < 2) {
      throw new BadRequestException('Entity must have at least 2 columns');
    }

    const columnNames = schema.map((column) => column.name);
    const uniqueColumnNames = new Set(columnNames);

    if (columnNames.length !== uniqueColumnNames.size) {
      throw new BadRequestException('Columns must have unique names');
    }

    const primaryKeyColumns = schema.filter(
      (column) => column.isPrimaryKey === true,
    );

    if (primaryKeyColumns.length !== 1) {
      throw new BadRequestException('Primary key must be one');
    }

    if (primaryKeyColumns[0].isNull === true) {
      throw new BadRequestException('Primary key cannot be null');
    }
  }
}
