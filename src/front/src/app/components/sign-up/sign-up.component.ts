import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  signUpForm = new FormGroup({
    nick: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {}

  get nick() {
    return this.signUpForm.get('nick');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  OnSubmit() {
    if (this.signUpForm.valid) {
      this.authService.createUser(this.signUpForm.value as any).subscribe(
        data => {
          this.router.navigate(['sign-in']);
        }
      );
    }
  }
}
