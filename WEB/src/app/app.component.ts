import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Environment indicator for development -->
      <div class="environment-indicator" *ngIf="!environment.production">
        <span>{{environment.appName}} - {{environment.version}}</span>
      </div>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
    }

    .environment-indicator {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(37, 99, 235, 0.8);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      z-index: 1000;
    }
  `]
})
export class AppComponent implements OnInit {
  title = environment.appName;
  environment = environment;

  ngOnInit(): void {
    if (environment.features.enableConsoleLogging) {
      console.log(`🚀 ${environment.appName} v${environment.version} started`);
      console.log('🌍 Environment:', environment.production ? 'Production' : 'Development');
      console.log('🔗 API URL:', environment.apiUrl);
      console.log('🔧 Features:', environment.features);
    }
  }
}