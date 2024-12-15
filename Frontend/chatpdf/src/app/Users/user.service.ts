import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './userType';
import { SERVER_URL } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user = signal<User>({
    name: '',
    email: '',
    password: ''
  });

  #http = inject(HttpClient);

  singup(data: User) {
    return this.#http.post<{ success: boolean, data: string; }>(SERVER_URL + 'users/register', data);
  }
  
  signin(user:{email:String, password:String}) {
    return this.#http.post<{ success: boolean, data: {access_token: string, refresh_token: string}; }>(SERVER_URL + 'users/login', user);
  }

}
