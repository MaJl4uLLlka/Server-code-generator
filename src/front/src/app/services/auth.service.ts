import { Injectable } from '@angular/core';
import { APPLICATION_DOMAIN } from '../config';
import { HttpClient } from '@angular/common/http';
import { AuthInputDto, AuthOutputDto } from '../dto/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  login(loginData: AuthInputDto) {
    return this.httpClient.post<AuthOutputDto>(APPLICATION_DOMAIN + '/auth', loginData, {});
  }

  isSigned() {
    return this.httpClient.get(APPLICATION_DOMAIN + '/auth', {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }
}
