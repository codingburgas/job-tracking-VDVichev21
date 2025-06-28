import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="min-vh-100 bg-light">
      <app-header></app-header>
      <main class="container-fluid py-4">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    body {
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class AppComponent {
  title = 'Jobber';
}