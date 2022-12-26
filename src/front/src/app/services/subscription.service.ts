import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APPLICATION_DOMAIN } from '../config';

export interface CardData {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  subscribe(cardData: CardData) {
    return this.http.post(APPLICATION_DOMAIN + '/subscription', cardData, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  getSubscription() {
    return this.http.get(APPLICATION_DOMAIN + '/subscription', {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    })
  }
}
