import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import {
  UpdateRepositoryNameDto,
  UpdateTemplateDto,
} from './dto/update-repository.dto';
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

    if (repositories.length === 0) {
      throw new NotFoundException('You dont have any repositories');
    }

    return repositories;
  }

  async findAllPublicRepositories(query: RepositoryQuery) {
    const repositories = await this.prismaService.repository.findMany({
      where: {
        type: RepositoryType.PUBLIC,
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

  async getCountOfPublicRepositories(filter = '') {
    const count = await this.prismaService.repository.count({
      where: {
        type: RepositoryType.PUBLIC,
        name: {
          contains: filter,
          mode: 'insensitive',
        },
      },
    });

    return { count: count };
  }

  async getCountOfUserRepositories(userId: string, filter = '') {
    const count = await this.prismaService.repository.count({
      where: {
        userId: userId,
        name: {
          contains: filter,
          mode: 'insensitive',
        },
      },
    });

    return { count: count };
  }

  async shareRepositoryToUser(
    repositoryId: string,
    ownerId: string,
    userNickName: string,
  ) {
    const repository = await this.findOne(repositoryId, ownerId);

    const user = await this.prismaService.user.findUnique({
      where: {
        nick: userNickName,
      },
    });

    if (user.id === ownerId) {
      throw new BadRequestException('You are owner of this repository');
    }

    const shared = await this.prismaService.privateRepositoryAccess.create({
      data: {
        repositoryId: repository.id,
        userId: user.id,
      },
    });

    return shared;
  }

  async findAllPrivateAvilable(userId: string, query: RepositoryQuery) {
    const skip = +query.page * +query.take;
    const count = await this.prismaService.privateRepositoryAccess.count({
      where: {
        userId: userId,
        repository: {
          name: {
            contains: query.filter,
            mode: 'insensitive',
          },
        },
      },
    });

    const repositories = [];

    const difference = skip - count;

    if (difference < 0 && Math.abs(difference) >= +query.take && count !== 0) {
      const privateRepositoriesWithAccess =
        await this.prismaService.privateRepositoryAccess.findMany({
          where: {
            userId: userId,
            repository: {
              name: {
                contains: query.filter,
                mode: 'insensitive',
              },
            },
          },
          take: +query.take,
          skip: skip,
          include: {
            repository: {
              include: {
                user: {
                  select: {
                    nick: true,
                  },
                },
              },
            },
          },
        });

      repositories.push(
        ...privateRepositoriesWithAccess.map((element) => element.repository),
      );
    } else if (difference < 0 && Math.abs(difference) < +query.take) {
      const needToTakeFromSecond = query.take - Math.abs(difference);

      const privateRepositoriesWithAccess =
        await this.prismaService.privateRepositoryAccess.findMany({
          where: {
            userId: userId,
            repository: {
              name: {
                contains: query.filter,
                mode: 'insensitive',
              },
            },
          },
          take: Math.abs(difference),
          skip: +query.page * +query.take,
          include: {
            repository: {
              include: {
                user: {
                  select: {
                    nick: true,
                  },
                },
              },
            },
          },
        });

      const userPrivateRepositories =
        await this.prismaService.repository.findMany({
          where: {
            userId: userId,
            type: RepositoryType.PRIVATE,
            name: {
              contains: query.filter,
              mode: 'insensitive',
            },
          },
          take: needToTakeFromSecond,
          include: {
            user: {
              select: {
                nick: true,
              },
            },
          },
        });

      repositories.push(
        ...privateRepositoriesWithAccess.map((element) => element.repository),
      );

      repositories.push(...userPrivateRepositories);
    } else if (difference >= 0) {
      const privateRepositories = await this.prismaService.repository.findMany({
        where: {
          userId: userId,
          type: RepositoryType.PRIVATE,
          name: {
            contains: query.filter,
            mode: 'insensitive',
          },
        },
        skip: difference,
        take: +query.take,
        include: {
          user: {
            select: {
              nick: true,
            },
          },
        },
      });

      repositories.push(...privateRepositories);
    }

    return repositories;
  }

  async getCountOfPrivateRepositories(userId: string, filter = '') {
    let count = await this.prismaService.privateRepositoryAccess.count({
      where: {
        userId: userId,
        repository: {
          name: {
            contains: filter,
            mode: 'insensitive',
          },
        },
      },
    });

    count += await this.prismaService.repository.count({
      where: {
        userId: userId,
        type: RepositoryType.PRIVATE,
        name: {
          contains: filter,
          mode: 'insensitive',
        },
      },
    });

    return { count: count };
  }

  async fillTemplates(repositoryId: string, userId: string = null) {
    const result: any = {};
    const repository = await this.prismaService.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (!userId && repository.type === RepositoryType.PRIVATE) {
      result.needRedirect = true;
      return result;
    }

    result.value = {};
  }

  async isRepositoryPrivate(repositoryId: string, userId: string) {
    const repository = await this.findOne(repositoryId, userId);

    const isPrivate = repository.type === RepositoryType.PRIVATE ? true : false;

    return { isPrivate: isPrivate };
  }

  async isUserRepositoryOwner(repositoryId: string, userId: string) {
    const repository = await this.findOne(repositoryId, userId);

    const isUserOwner = userId === repository.userId ? true : false;

    return { isUserOwner: isUserOwner };
  }

  async updateTemplate(
    repositoryId: string,
    userId: string,
    templateData: UpdateTemplateDto,
  ) {
    const repository = await this.findOne(repositoryId, userId);

    if (templateData.entityTemplate) {
      await this.templateService.updateEntityTemplate(repository.templateId, {
        value: templateData.entityTemplate,
      });
    }

    if (templateData.serviceTemplate) {
      await this.templateService.updateServiceTemplate(repository.templateId, {
        value: templateData.serviceTemplate,
      });
    }

    if (templateData.controllerTemplate) {
      await this.templateService.updateControllerTemplate(
        repository.templateId,
        { value: templateData.controllerTemplate },
      );
    }

    return await this.findOne(repositoryId, userId);
  }
}
