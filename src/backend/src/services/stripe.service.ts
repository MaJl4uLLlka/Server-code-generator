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

    return await this.stripe.customers.createSource(customerId, {
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

  async getSubscription(customerId: string) {
    const subscriptionList = await this.stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active',
    });

    return subscriptionList.data;
  }

  async createCustomerCheckoutSession(customerId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: process.env.SUBSCRIPTION_PRICE, quantity: 1 }],
      success_url: `${process.env.BASE_URL}`,
      cancel_url: `${process.env.BASE_URL}`,
      currency: 'usd',
      customer: customerId,
    });

    return session;
  }
}
