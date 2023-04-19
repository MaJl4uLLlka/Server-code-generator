import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { UpdateRepositoryDto } from './dto/update-repository.dto';
import { RepositoryQuery } from './dto/get-repository.dto';
import { PrismaService } from '../services/prisma.service';
import { StripeService } from '../services/stripe.service';
import { User } from '@prisma/client';
import JSZip from 'jszip';
import { buildTemplate } from '../utils/templates/rest-api';

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

  async getRepositoryWithDeepDependencies(repositoryId: string) {
    return await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
      include: {
        entities: {
          include: {
            fromLinks: true,
            toLinks: true,
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
    const zip = new JSZip();
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
      .filter((value) => value.length !== 0);

    for (let index = 0; index < pathes.length; index++) {
      zip.file(pathes[index], preparedTemplates[index]);
    }

    return await zip.generateAsync({ type: 'uint8array' });
  }
}
