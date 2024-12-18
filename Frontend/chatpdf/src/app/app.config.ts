import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { HomeComponent } from './home.component';
import { SignupComponent } from './Users/signup.component';
import { SigninComponent } from './Users/signin.component';
import { addTokenInterceptor } from './add-token.interceptor';
import { UsersService } from './Users/user.service';
import { jwtDecode } from 'jwt-decode';


function isTokenValid(token: string): boolean {
  try {
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp;

    if (expirationTime) {
      const currentTime = Math.floor(Date.now() / 1000); 
      return expirationTime > currentTime;
    } else {
      return false; // Token doesn't have an expiration claim
    }
  } catch (error) {
    return false; // Token is invalid or malformed
  }
}

function initialize() {
  const state_service = inject(UsersService);
  const state = localStorage.getItem('RAG_APP_STATE');
  if (state && isTokenValid(JSON.parse(state).jwt)) {
    state_service.$user.set(JSON.parse(state));
  }
}



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    provideAppInitializer(initialize),
    provideRouter([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'signup', component: SignupComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'chat', loadComponent: () => import('./chatting/chat/chat.component').then(m => m.ChatComponent),
        canActivate: [() => inject(UsersService).isLoggedIn()]
       },
      { path: '**', component: HomeComponent },
    ], withComponentInputBinding(), withViewTransitions(), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};
