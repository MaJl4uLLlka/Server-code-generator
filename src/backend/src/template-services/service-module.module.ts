import { Module } from '@nestjs/common';
import { EntityTemplateService } from './entity-template.service';
import { ServiceTemplateService } from './service-template.service';
import { TemplateService } from './template.service';
import { TemplateInfoService } from './template-info.service';
import { ControllerTemplateService } from './controller-template.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  providers: [
    TemplateService,
    EntityTemplateService,
    ServiceTemplateService,
    ControllerTemplateService,
    TemplateInfoService,
    PrismaService,
  ],
  exports: [
    TemplateService,
    EntityTemplateService,
    ServiceTemplateService,
    TemplateService,
    TemplateInfoService,
  ],
})
export class ServiceModuleModule {}
