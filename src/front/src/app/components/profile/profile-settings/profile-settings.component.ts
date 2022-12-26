import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProfileServiceService } from '../../../services/profile-service/profile-service.service';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  userInfoForm = new FormGroup({
    nick: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)])
  });

  constructor(private profileService: ProfileServiceService, private snackBar: MatSnackBar){}

  get nick() {
    return this.userInfoForm.get('nick');
  }

  set nickname(value: string) {
    this.userInfoForm.controls.nick.setValue(value);
  }

  ngOnInit(): void {
    this.profileService.getUserProfileInfo()
    .subscribe(
      data => {
        this.nickname = (data as any).nick;
      }
    )
  }

  OnSubmit() {
    if (this.userInfoForm.valid) {
      this.profileService.updateNickname(this.userInfoForm.value as any)
      .subscribe(
        data => {
          this.nickname = (data as any).nick
        },
        err => this.snackBar.open(err.error.message, undefined, { duration: 2500 })
      )
    }
  }
}
