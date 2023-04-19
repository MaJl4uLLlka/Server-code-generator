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
    try {
      await this.stripeService.createCard(user.stripeAccountId, cardData);
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSubscription(customerId: string) {
    const subscription = await this.stripeService.getSubscription(customerId);

    if (subscription.length !== 1) {
      throw new BadRequestException('User has not a subscription');
    }

    return subscription[0];
  }

  async createCheckoutSession(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    const session = await this.stripeService.createCustomerCheckoutSession(
      user.stripeAccountId,
    );

    return { url: session.url };
  }
}
