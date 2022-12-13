import { Injectable } from '@angular/core';
import { APPLICATION_DOMAIN } from '../config';
import { HttpClient } from '@angular/common/http';
import { AuthInputDto, AuthOutputDto, CreateUserData } from '../dto/index';

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

  createUser(userData: CreateUserData) {
    return this.httpClient.post(APPLICATION_DOMAIN + '/users', userData);
  }
}
