import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsersService, initial_state } from './Users/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
  
@if(userService.isLoggedIn())
{

<div class="flex justify-end">  
<div class="relative inline-block text-left">
  <div>
    <button type="button" (mouseenter)="toggleDropdown()"    (click)="toggleDropdown()" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      aria-expanded="isOpen" aria-haspopup="true">
      <span>Welcome {{userService.$user().name}}</span>
      <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
  @if (isOpen){
    <div class="opacity-100 scale-100 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-out duration-100 transform" 
   >
   <div (mouseleave)="toggleDropdown()" class="py-1" role="none">
         <button class="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-3" (click)="signout()">Sign out</button>

    </div>
  </div>
  }@else {
  <div class="opacity-0 scale-95 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-out duration-100 transform" 
       >
    <div class="py-1" role="none">
         <button class="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-3" (click)="signout()">Sign out</button>

    </div>
  </div>
  }
</div>
</div>




}
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
  userService = inject(UsersService);
  #router = inject(Router);

  signout() {
    this.userService.$user.set(initial_state);
    this.#router.navigate(['']);
  }


  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  
}

