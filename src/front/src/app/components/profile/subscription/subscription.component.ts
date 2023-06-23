import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cardNumber, monthValue, yearValue, cvcValue } from '../../../validators';
import { SubscriptionService } from '../../../services/subscription.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  hasSubscription = false;
  subscriptionData: {periodStart: Date, periodEnd: Date};
  cardForm = new FormGroup({
    number: new FormControl('', [Validators.required, cardNumber()]),
    exp_month:  new FormControl('', [Validators.required, monthValue()]),
    exp_year:   new FormControl('', [Validators.required, yearValue()]),
    cvc:    new FormControl('', [Validators.required, cvcValue()]),
  });

  constructor(private subscriptionService: SubscriptionService, private router: Router, private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    this.subscriptionService.getSubscription()
      .subscribe(
        (data: any) => { 
          this.hasSubscription = true;
          this.subscriptionData = {periodEnd: new Date(), periodStart: new Date()};
          this.subscriptionData.periodStart = new Date(data.current_period_start * 1000);
          this.subscriptionData.periodEnd = new Date(data.current_period_end * 1000);
        },
      );
  }

  checkout() {
    this.subscriptionService.checkout()
      .subscribe((data: any) =>{
        console.log(data);
        window.location = data.url 
      });
  }
}
