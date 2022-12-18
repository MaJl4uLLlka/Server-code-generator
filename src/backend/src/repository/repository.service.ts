import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryNameDto } from './dto/update-repository.dto';
import { RepositoryQuery } from './dto/get-repository.dto';
import { PrismaService } from '../services/prisma.service';
import { User } from '@prisma/client';
import { TemplateInfoService } from '../template-services/template-info.service';

export enum RepositoryType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

@Injectable()
export class RepositoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly templateService: TemplateInfoService,
  ) {}

  async create(createRepositoryDto: CreateRepositoryDto, user: User) {
    console.log(user);
    const repositoriesWithThisName =
      await this.prismaService.repository.findMany({
        where: {
          AND: [{ userId: user.id }, { name: createRepositoryDto.name }],
        },
      });

    if (repositoriesWithThisName.length !== 0) {
      throw new BadRequestException(
        'You already have a repositories with this name',
      );
    }

    const emptyTemplate = await this.templateService.createEmptyTemplate();

    const repository = await this.prismaService.repository.create({
      data: {
        ...(createRepositoryDto as any),
        templateId: emptyTemplate.id,
        userId: user.id,
      },
    });

    return repository;
  }

  async findAllByUserId(userId: string, query: RepositoryQuery) {
    const repositories = await this.prismaService.repository.findMany({
      where: {
        userId: userId,
      },
      skip: +query.page * +query.take,
      take: +query.take,
      include: {
        user: {
          select: {
            nick: true,
          },
        },
      },
    });

    if (repositories.length === 0) {
      throw new NotFoundException('You dont have any repositories');
    }

    return repositories;
  }

  async findAllPublicRepositories(query: RepositoryQuery) {
    const repositories = await this.prismaService.repository.findMany({
      where: {
        type: RepositoryType.PUBLIC,
      },
      skip: +query.page * +query.take,
      take: +query.take,
      include: {
        user: {
          select: {
            nick: true,
          },
        },
      },
    });

    if (repositories.length === 0) {
      throw new NotFoundException('There are no public repositories yet');
    }

    return repositories;
  }

  async findOne(id: string, userId: string) {
    const repository = await this.prismaService.repository.findFirst({
      where: {
        AND: [{ id: id }, { userId: userId }],
      },
      include: {
        template: {
          include: {
            entityTemplate: true,
            serviceTemplate: true,
            controllerTemplate: true,
          },
        },
      },
    });

    if (!repository) {
      throw new NotFoundException('Repository not exists');
    }

    return repository;
  }

  async updateRepositoryName(
    id: string,
    repositoryData: UpdateRepositoryNameDto,
    userId: string,
  ) {
    const repositoriesWithThisName =
      await this.prismaService.repository.findMany({
        where: {
          AND: [{ userId: userId }, { name: repositoryData.name }],
        },
      });

    if (repositoriesWithThisName.length !== 0) {
      throw new BadRequestException(
        'You already have a repositories with this name',
      );
    }

    await this.findOne(id, userId);

    const updated = await this.prismaService.repository.update({
      where: {
        id: id,
      },
      data: {
        name: repositoryData.name,
      },
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    const deleted = await this.prismaService.repository.delete({
      where: {
        id: id,
      },
    });

    return deleted;
  }

  async getCountOfPublicRepositories() {
    const count = await this.prismaService.repository.count({
      where: {
        type: RepositoryType.PUBLIC,
      },
    });

    return { count: count };
  }

  async getCountOfUserRepositories(userId: string) {
    const count = await this.prismaService.repository.count({
      where: {
        userId: userId,
      },
    });

    return { count: count };
  }
}
