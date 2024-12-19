import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from './user.service';
import { User, Token } from './userType';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
<form [formGroup]="form" (ngSubmit)="submit()" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-6 text-center">Sign in</h2>
  
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      placeholder="Enter your email" 
      [formControl]="form.controls.email" 
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password:</label>
    <input 
      type="password" 
      id="password" 
      placeholder="Enter your password" 
      [formControl]="form.controls.password" 
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>

  <button 
    [disabled]="form.invalid" 
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
  >
    Login
  </button>

  <p class="mt-4 text-center text-gray-600">
    <a [routerLink]="['/signup']" class="text-blue-500 hover:text-blue-700"><i>Sign up</i></a> if you don't have an account
  </p>
</form>
  `,
  styles: ``
})
export class SigninComponent {
  #user_service = inject(UsersService);
  #state = inject(UsersService);
  #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required],
  });

  submit() {
    this.#user_service.signin(this.form.value as {email:String, password:String}).subscribe(response => {
      if(response.success== false){
          alert("Credentials are invalid!");  
          return;
      } 
      const decoded = jwtDecode(response.data.access_token) as Token;
      this.#state.$user.set({
        name: decoded.fullname,
        email: decoded.email,
        id: decoded.user_id,
        jwt: response.data.access_token
      });
      this.#router.navigate(['chat']);
    },
    error => {
      console.error('Error occurred:', error);
      alert("Credentials are invalid!");  
    }); 
  }

}
