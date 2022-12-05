import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ControllerTemplateService extends TemplateService {
  constructor(prismaService: PrismaService) {
    super(
      prismaService,
      'controllerTemplate',
      'Controller template with this id not exists',
    );
  }
}
