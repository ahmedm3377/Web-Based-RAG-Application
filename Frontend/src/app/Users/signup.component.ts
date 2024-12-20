import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from './user.service';
import { AsyncPipe } from '@angular/common';

@Component({
selector: 'app-signup',
imports: [ReactiveFormsModule, RouterLink],
template: `

<form [formGroup]="form" (ngSubmit)="submit()" class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">

    <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

    <div class="mb-4">

          <label class="block text-gray-700 text-sm font-bold mb-2" for="fullname">Full Name:</label>

          <input
            id="fullname"
            placeholder="Enter your fullname"
            [formControl]="form.controls.fullname"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline {{ fullname!.invalid && (fullname!.dirty || fullname!.touched) ? 'border-red-500' : '' }}"

          />

          @if(fullname!.invalid && (fullname!.dirty || fullname!.touched))

          {

              <p class="text-red-500 text-xs mt-1">

              Full name is required and must be at least 3 characters long.

              </p>

          }

    </div>

    <div class="mb-4">

          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email:</label>

          <input

              type="email"

              id="email"

              placeholder="Enter your email"

              [formControl]="form.controls.email"

              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline

              {{ email!.invalid && (email!.dirty || email!.touched) ? 'border-red-500' : '' }}"

          />

          @if(email!.invalid && (email!.dirty || email!.touched)){

              <p class="text-red-500 text-xs mt-1">

              A valid email is required.

              </p>

          }

    </div>

    <div class="mb-4">

        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password:</label>

        <input

            type="password"

            id="password"

            placeholder="Enter your password"

            [formControl]="form.controls.password"

            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline

            {{ password!.invalid && (password!.dirty || password!.touched) ? 'border-red-500' : '' }}"

        />

        @if(password!.invalid && (password!.dirty || password!.touched)){

            <p class="text-red-500 text-xs mt-1">

            Password is required and must be at least 6 characters long.

            </p>

        }

    </div>

    <button  type="submit"  [disabled]="form.invalid"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
      Sign Up
    </button>

    <p class="mt-4 text-center text-gray-600">

      <a [routerLink]="['/signin']" class="text-blue-500 hover:text-blue-700"><i>Sign in</i></a> if you already have an account

    </p>

</form>

`,

styles: ``

})

export class SignupComponent {

#router = inject(Router);

#users_service = inject(UsersService);

form = inject(FormBuilder).nonNullable.group(
{
  'fullname': ['', [Validators.required, Validators.minLength(3)]],
  'email': ['', [Validators.required, Validators.email]],
  'password': ['',[ Validators.required, Validators.minLength(6)]],
}
)
submit(){

const signupData = {
   fullname:this.form.controls.fullname.value,
   email:this.form.controls.email.value,
   password:this.form.controls.password.value,
}


this.#users_service.singup(signupData).subscribe(response => {
  console.log(response.success);
  this.#router.navigate(['', 'signin']);
});   
}

get fullname() {
return this.form.get('fullname');
}

get email() {
return this.form.get('email');
}

get password() {
return this.form.get('password');
}
}