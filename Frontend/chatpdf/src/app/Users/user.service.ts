import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './userType';
import { SERVER_URL } from '../../../environments/environment.development';



export type GlobalState = {
  name: string,
  email: string,
  id: string,
  jwt: string;
};

export const initial_state = {
  name: '',
  email: '',
  id: '',
  jwt: ''
};


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  $user = signal<GlobalState>(initial_state);

  #http = inject(HttpClient);

  myeffect = effect(() => {
    localStorage.setItem('RAG_APP_STATE', JSON.stringify(this.$user()));
  });


  singup(data: User) {
    return this.#http.post<{ success: boolean, data: string; }>(SERVER_URL + 'users/register', data);
  }
  
  signin(user:{email:String, password:String}) {
    return this.#http.post<{ success: boolean, data: {access_token: string, refresh_token: string}; }>(SERVER_URL + 'users/login', user);
  }

  isLoggedIn() {
    return this.$user().id ? true : false;
  }

}
