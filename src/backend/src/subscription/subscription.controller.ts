import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CardData } from '../services/stripe.service';
import { User } from '@prisma/client';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Req() req: any, @Body() cardData: CardData) {
    const user = req['user'] as User;
    return this.subscriptionService.create(user, cardData);
  }

  @Get()
  async getUserSubscription(@Req() req: any) {
    const user = req['user'] as User;
    return this.subscriptionService.getSubscription(user.stripeAccountId);
  }

  @Post('checkout-session')
  async createCheckoutSession(@Req() req: any) {
    const user = req.user as User;
    const session = await this.subscriptionService.createCheckoutSession(
      user.id,
    );

    return session;
  }
}
