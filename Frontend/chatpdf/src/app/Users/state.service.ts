import { effect, Injectable, signal } from '@angular/core';

export type UserState = {
  fullname: string,
  email: string,
  user_id: string,
  jwt: string;
};

export const initial_state = {
  fullname: '',
  email: '',
  user_id: '',
  jwt: ''
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  $state = signal<UserState>(initial_state);

  myeffect = effect(() => {
    localStorage.setItem('USER_STATE', JSON.stringify(this.$state()));
  });

  isLoggedIn() {
    return this.$state().user_id ? true : false;
  }
}
