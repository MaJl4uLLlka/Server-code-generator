import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';

export interface CardData {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: number;
}

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe;
  async onModuleInit() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createCustomer(email: string) {
    const customer = await this.stripe.customers.create({
      email: email,
    });

    return customer;
  }

  async createCard(customerId: string, cardData: CardData) {
    const token = await this.stripe.tokens.create({
      card: {
        ...(cardData as any),
      },
    });

    await this.stripe.customers.createSource(customerId, {
      source: token.id,
    });
  }

  async createSubscription(customerId: string) {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: process.env.SUBSCRIPTION_PRICE }],
    });

    return subscription;
  }
}
