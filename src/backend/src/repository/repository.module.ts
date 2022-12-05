import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { PrismaService } from '../services/prisma.service';
import { TemplateInfoService } from '../template-services/template-info.service';

@Module({
  controllers: [RepositoryController],
  providers: [RepositoryService, PrismaService, TemplateInfoService],
})
export class RepositoryModule {}
