import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSigned = false;
  private subscriptionName: Subscription;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private readonly authService: AuthService) {
      this.subscriptionName = this.commonService.getUpdate().subscribe(
        data => {
          console.log(data);
          this.isSigned = JSON.parse(data).isSigned;
        }
      )
    }

  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.isSigned().subscribe(
      data => {
        this.isSigned = true;
      }
    )
  }

  logout() {
    localStorage.clear();
    this.isSigned = false;
    this.router.navigate(['info']);
  }
}
