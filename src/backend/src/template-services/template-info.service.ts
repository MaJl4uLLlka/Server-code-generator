import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ControllerTemplateService } from './controller-template.service';
import { ServiceTemplateService } from './service-template.service';
import { EntityTemplateService } from './entity-template.service';
import { TemplateDto } from './dto/template.dto';

@Injectable()
export class TemplateInfoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly entityTemplateService: EntityTemplateService,
    private readonly serviceTemplateService: ServiceTemplateService,
    private readonly controllerTemplateService: ControllerTemplateService,
  ) {}

  async createEmptyTemplate() {
    const entityTemplate = await this.entityTemplateService.createEmpty();
    const serviceTemplate = await this.serviceTemplateService.createEmpty();
    const controllerTemplate =
      await this.controllerTemplateService.createEmpty();

    const template = await this.prismaService.templateInfo.create({
      data: {
        entityTemplate: {
          connect: {
            id: entityTemplate.id,
          },
        },
        serviceTemplate: {
          connect: {
            id: serviceTemplate.id,
          },
        },
        controllerTemplate: {
          connect: {
            id: controllerTemplate.id,
          },
        },
      },
    });

    return template;
  }

  async getTemplateById(templateId: string) {
    const template = this.prismaService.templateInfo.findUnique({
      where: {
        id: templateId,
      },
      include: {
        entityTemplate: true,
        serviceTemplate: true,
        controllerTemplate: true,
      },
    });

    if (!template) {
      throw new NotFoundException('Template with this is not exists');
    }

    return template;
  }

  async updateEntityTemplate(
    templateId: string,
    entityTemplateData: TemplateDto,
  ) {
    const template = await this.getTemplateById(templateId);
    const updated = await this.entityTemplateService.update(
      template.entityTemplate.id,
      entityTemplateData,
    );

    return updated;
  }

  async updateServiceTemplate(
    templateId: string,
    serviceTemplateData: TemplateDto,
  ) {
    const template = await this.getTemplateById(templateId);
    const updated = await this.serviceTemplateService.update(
      template.serviceTemplate.id,
      serviceTemplateData,
    );

    return updated;
  }

  async updateControllerTemplate(
    templateId: string,
    controllerTemplateData: TemplateDto,
  ) {
    const template = await this.getTemplateById(templateId);
    const updated = await this.serviceTemplateService.update(
      template.controllerTemplate.id,
      controllerTemplateData,
    );

    return updated;
  }
}
