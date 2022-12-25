import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CardData, StripeService } from '../services/stripe.service';
import { PrismaService } from '../services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private stripeService: StripeService,
  ) {}

  async create(user: User, cardData: CardData) {
    const card = await this.stripeService.createCard(user.id, cardData);
  }

  async getSubscription() {
    return 1;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  async cancel(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
