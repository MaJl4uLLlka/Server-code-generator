import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ServiceTemplateService extends TemplateService {
  constructor(prismaService: PrismaService) {
    super(
      prismaService,
      'serviceTemplate',
      'Service template with this id not exists',
    );
  }
}
