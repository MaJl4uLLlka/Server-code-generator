import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cardNumber, monthValue, yearValue, cvcValue } from '../../../validators';

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
      console.log(this.cardForm.value);
    }
  }
}
