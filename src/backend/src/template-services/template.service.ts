import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TemplateDto } from './dto/template.dto';

export class TemplateService {
  entity: string;
  notFoundErrorMessage: string;

  constructor(
    private readonly prismaService: PrismaService,
    entity: string,
    notFoundErrorMessage: string,
  ) {
    this.entity = entity;
    this.notFoundErrorMessage = notFoundErrorMessage;
  }

  async createEmpty() {
    const emptyTemplate = await this.prismaService[this.entity].create({
      data: {},
    });

    return emptyTemplate;
  }

  async findById(templateId: string) {
    const template = await this.prismaService[this.entity].findUnique({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      throw new NotFoundException(this.notFoundErrorMessage);
    }

    return template;
  }

  async update(templateId: string, templateData: TemplateDto) {
    const entityTemplate = await this.findById(templateId);

    const updated = await this.prismaService[this.entity].update({
      where: {
        id: entityTemplate.id,
      },
      data: {
        value: templateData.value,
      },
    });

    return updated;
  }
}
