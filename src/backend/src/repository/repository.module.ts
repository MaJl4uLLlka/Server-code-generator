import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { PrismaService } from '../services/prisma.service';
import { StripeService } from '../services/stripe.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Module({
  imports: [],
  controllers: [RepositoryController],
  providers: [
    RepositoryService,
    PrismaService,
    StripeService,
    SubscriptionService,
  ],
})
export class RepositoryModule {}
