import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsersService } from './Users/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
   <span>Welcome {{loggedInUser().name}}</span>
   @if(loggedInUser().email)
    { <button [routerLink]="['']"> Sign out</button>}
   @else{
    <button [routerLink]="['signup']">Sign up</button> | 
    <button [routerLink]="['signin']"> Sign in</button> | 
    <button [routerLink]="['chat']"> chat</button>
   }
   
    <router-outlet></router-outlet>
  
  
  `,
  styles: [],
})
export class AppComponent {
  loggedInUser = inject(UsersService).user;

  
}
