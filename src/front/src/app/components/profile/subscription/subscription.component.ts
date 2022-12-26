import { Component } from '@angular/core';
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
export class SubscriptionComponent {
  cardForm = new FormGroup({
    number: new FormControl('', [Validators.required, cardNumber()]),
    exp_month:  new FormControl('', [Validators.required, monthValue()]),
    exp_year:   new FormControl('', [Validators.required, yearValue()]),
    cvc:    new FormControl('', [Validators.required, cvcValue()]),
  });

  constructor(private subscriptionService: SubscriptionService, private router: Router, private snackBar: MatSnackBar) {}

  get number() {
    return this.cardForm.get('number');
  }

  get exp_month() {
    return this.cardForm.get('exp_month');
  }

  get exp_year() {
    return this.cardForm.get('exp_year');
  }

  get cvc() {
    return this.cardForm.get('cvc');
  }

  OnSubmit() {
    if (this.cardForm.valid) {
      this.subscriptionService.subscribe(this.cardForm.value as any)
        .subscribe(
          data => {
            this.router.navigate(['profile']);
          },
          err => {
            this.snackBar.open(err.error.message, undefined, { duration: 2500 });
          }
        );
    }
  }
}
