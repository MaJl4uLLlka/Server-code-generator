import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CardData, StripeService } from '../services/stripe.service';
import { PrismaService } from '../services/prisma.service';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private stripeService: StripeService,
  ) {}

  async create(user: User, cardData: CardData) {
    await this.stripeService.createCard(user.id, cardData);
    const stripeSubscription = await this.stripeService.createSubscription(
      user.stripeAccountId,
    );

    const subscription = await this.prismaService.subscription.create({
      data: {
        userId: user.id,
        stripeSubsctiptionId: stripeSubscription.id,
      },
    });

    return subscription;
  }

  async getSubscription(customerId: string) {
    const subscription = await this.stripeService.getSubscription(customerId);

    if (subscription.length !== 1) {
      throw new BadRequestException('User has not a subscription');
    }

    return subscription[0];
  }
}
