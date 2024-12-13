import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
      <form [formGroup]="form" (ngSubmit)="submit()">
      <label> Full name: </label>
      <input placeholder="Write your fullname here" [formControl]="form.controls.fullname"/>
      <label> Email: </label>
      <input placeholder="Write your email here" [formControl]="form.controls.email"/>
      <label> Password: </label>
      <input type="password" placeholder="Write your password here" [formControl]="form.controls.password"/>
      <button [disabled]="form.invalid">Sign up</button>
      <p>you have an account, <a [routerLink]="['/routePath']">sign in</a></p>
    </form>
  `,
  styles: ``
})
export class SignupComponent {
  #router = inject(Router);


form  = inject(FormBuilder).nonNullable.group(
  {
    'email': ['', Validators.required, Validators.email],
    'fullname': ['', Validators.required],
    'password': ['', Validators.required],
  }
)
submit(){
    const formData = new FormData();
    formData.append('fullname', this.form.controls.fullname.value);
    formData.append('email', this.form.controls.email.value);
    formData.append('password', this.form.controls.password.value);
    
    
}
}
