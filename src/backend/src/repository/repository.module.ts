import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { PrismaService } from '../services/prisma.service';
import { StripeService } from '../services/stripe.service';
import { ServiceModuleModule } from '../template-services/service-module.module';

@Module({
  imports: [ServiceModuleModule],
  controllers: [RepositoryController],
  providers: [RepositoryService, PrismaService, StripeService],
})
export class RepositoryModule {}
