import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Zone.js
import 'zone.js';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

console.log('Starting Angular application...');

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, FormsModule, ReactiveFormsModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => {
  console.error('Error starting application:', err);
});