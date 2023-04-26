import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { RepositoryQuery } from './dto/get-repository.dto';
import { PrismaService } from '../services/prisma.service';
import { StripeService } from '../services/stripe.service';
import { User } from '@prisma/client';
import { buildTemplate } from '../utils/templates/rest-api';
import AdmZip = require('adm-zip');

@Injectable()
export class RepositoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
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

    const { config, ...repositoryData } = createRepositoryDto;

    const repository = await this.prismaService.repository.create({
      data: {
        ...repositoryData,
        user: {
          connect: {
            id: user.id,
          },
        },
        config: {
          create: config,
        },
      },
      include: {
        config: true,
      },
    });

    return repository;
  }

  async findAllByUserId(userId: string, query: RepositoryQuery) {
    const repositoriesCollection: any = {
      items: [],
      count: 0,
      page: +query.page,
      pageCount: 0,
    };

    const repositoriesCount = await this.prismaService.repository.count({
      where: {
        userId: userId,
        name: {
          contains: query.filter,
          mode: 'insensitive',
        },
      },
    });

    const repositories = await this.prismaService.repository.findMany({
      where: {
        userId: userId,
        name: {
          contains: query.filter,
          mode: 'insensitive',
        },
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

    repositoriesCollection.count = repositoriesCount;
    repositoriesCollection.items.push(...repositories);
    repositoriesCollection.pageCount = Math.ceil(
      repositoriesCount / Number(query.take),
    );

    return repositoriesCollection;
  }

  async findOne(id: string, userId: string) {
    const repository = await this.prismaService.repository.findFirst({
      where: {
        AND: [{ id: id }, { userId: userId }],
      },
      include: {
        user: {
          select: {
            nick: true,
          },
        },
        config: true,
        entities: true,
        services: true,
        controllers: true,
      },
    });

    return repository;
  }

  async updateRepository(
    id: string,
    repositoryData: UpdateRepositoryDto,
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
        config: {
          update: {
            dbConnectionUri: repositoryData.config.dbConnectionUri,
            port: repositoryData.config.port,
            apiPrefix: repositoryData.config.apiPrefix,
          },
        },
      },
      include: {
        config: true,
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

  async isUserRepositoryOwner(repositoryId: string, userId: string) {
    let isUserOwner = true;

    try {
      await this.findOne(repositoryId, userId);
    } catch (error) {
      isUserOwner = false;
    }

    return { isUserOwner };
  }

  async getRepositoryEntities(repositoryId: string) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        entities: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const { entities } = repository;

    return entities;
  }

  async getRepositoryServices(repositoryId: string) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const { services } = repository;

    return services;
  }

  async getRepositoryControllers(repositoryId: string) {
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        controllers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const { controllers } = repository;

    return controllers;
  }

  async getRepositoryWithDeepDependencies(repositoryId: string) {
    return await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        entities: {
          include: {
            fromLinks: {
              include: {
                toEntity: true,
                fromEntity: true,
              },
            },
            toLinks: {
              include: {
                toEntity: true,
                fromEntity: true,
              },
            },
          },
        },
        services: {
          include: {
            entity: true,
          },
        },
        controllers: {
          include: {
            service: true,
          },
        },
        config: true,
      },
    });
  }

  async prepareArchive(repositoryId: string) {
    const zip = new AdmZip();
    const repository = await this.getRepositoryWithDeepDependencies(
      repositoryId,
    );

    const template = buildTemplate(repository);
    const parsedPathes = template.match(/@@(.+)\.js;/g);
    const pathes = parsedPathes.map((path) =>
      path.replace('@@', '').replace(';', ''),
    );

    const preparedTemplates = template
      .replace(/@@(.+)\.js;/g, '@@')
      .split('@@')
      .filter((value) => value.trim().length !== 0);

    console.log(
      `pathes: ${pathes.length}, templates: ${preparedTemplates.length}`,
    );

    for (let index = 0; index < pathes.length; index++) {
      zip.addFile(
        pathes[index],
        Buffer.from(preparedTemplates[index], 'utf-8'),
      );
    }

    return await zip.toBufferPromise();
  }

  async getAllLinks(repositoryId: string) {
    const entities = await this.prismaService.entity.findMany({
      where: {
        repositoryId: repositoryId,
      },
      include: {
        fromLinks: {
          include: {
            fromEntity: true,
            toEntity: true,
          },
        },
      },
    });

    const links = [];
    entities.forEach((entity) => {
      if (entity.fromLinks.length !== 0) {
        links.push(entity.fromLinks);
      }
    });

    const result = links
      .flatMap((link) => link)
      .map((link) => {
        return {
          from: link.fromEntity.name,
          to: link.toEntity.name,
          linkType: link.linkType,
        };
      });

    return result;
  }
}
