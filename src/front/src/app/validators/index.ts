import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cardNumber() {
    return (control: AbstractControl): ValidationErrors | null => {
        const regex =  /[0-9]{16}/g;
        const value = control.value;

        const isValid = regex.test(value);
        return !isValid?{ incorrect: true } : null;
    }
}

export function monthValue() {
    return (control: AbstractControl): ValidationErrors | null => {
        const regex =  /(0[1-9])|(1[0-9]{1})/g;
        const value = control.value;

        const isValid = regex.test(value);
        return !isValid?{ incorrect: true } : null;
    }
}

export function yearValue() {
    return (control: AbstractControl): ValidationErrors | null => {
        const regex =  /[0-9]{2}/g;
        const value = control.value;

        const isValid = regex.test(value);
        return !isValid?{ incorrect: true } : null;
    }
}

export function cvcValue() {
    return (control: AbstractControl): ValidationErrors | null => {
        const regex =  /[0-9]{3}/g;
        const value = control.value;

        const isValid = regex.test(value);
        return !isValid?{ incorrect: true } : null;
    }
}
