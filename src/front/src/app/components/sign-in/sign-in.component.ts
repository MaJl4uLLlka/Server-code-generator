import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthInputDto } from '../../dto';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  errors: any[]

  constructor(
    private router: Router,
    private commonService: CommonService,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  get error() {
    return this.errors[0];
  }

  OnSubmit() {
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
      this.authService.login(this.signInForm.value as AuthInputDto).subscribe(
        data => {
          localStorage.setItem('token', data.token);
          this.commonService.sendUpdate({ isSigned: true });
          this.router.navigate(['repositories']);
        },
        err => {
          console.log(err.error.message);
          this.snackBar.open(err.error.message, undefined, { duration: 2000 } );
        }
      )
    }
  }
}
