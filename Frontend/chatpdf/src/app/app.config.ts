import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { HomeComponent } from './home.component';
import { SignupComponent } from './Users/signup.component';
import { SigninComponent } from './Users/signin.component';
import { addTokenInterceptor } from './add-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    provideRouter([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'signup', component: SignupComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'chat', loadComponent: () => import('./chatting/chat/chat.component').then(m => m.ChatComponent) },
      { path: '**', component: HomeComponent },
    ], withComponentInputBinding(), withViewTransitions(), withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideAnimationsAsync(),
    provideHttpClient()
  ]
};
