import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPLICATION_DOMAIN } from 'src/app/config';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  constructor(private http: HttpClient) {}

  getUserProfileInfo() {
    return this.http.get(APPLICATION_DOMAIN + '/users', {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    })
  }

  updateNickname(nickname: {nick: string}) {
    return this.http.put(APPLICATION_DOMAIN + '/users', nickname, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    })
  }
}
