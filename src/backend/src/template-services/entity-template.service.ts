import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class EntityTemplateService extends TemplateService {
  constructor(prismaService: PrismaService) {
    super(
      prismaService,
      'entityTemplate',
      'Entity template with this id not exists',
    );
  }
}
