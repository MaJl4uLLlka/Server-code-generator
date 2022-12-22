import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CardData, StripeService } from '../services/stripe.service';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private stripeService: StripeService,
  ) {}

  async create(userId: string, cardData: CardData) {
    const subscription = await this.prismaService.subscription.create({
      data: {},
    });
  }

  async getSubscription() {
    return `This action returns a #${id} subscription`;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  async cancel(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
