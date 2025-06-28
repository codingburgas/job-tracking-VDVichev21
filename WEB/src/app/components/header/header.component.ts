import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" routerLink="/jobs">Jobber</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs" routerLinkActive="active">Jobs</a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn() && !isAdmin()">
              <a class="nav-link" routerLink="/applications" routerLinkActive="active">My Applications</a>
            </li>
            <li class="nav-item" *ngIf="isAdmin()">
              <a class="nav-link" routerLink="/admin/jobs" routerLinkActive="active">Manage Jobs</a>
            </li>
            <li class="nav-item" *ngIf="isAdmin()">
              <a class="nav-link" routerLink="/admin/applications" routerLinkActive="active">Applications</a>
            </li>
          </ul>

          <div class="d-flex align-items-center">
            <span *ngIf="currentUser" class="text-muted me-3">
              Welcome, {{currentUser.firstName}}
            </span>
            <div *ngIf="!isLoggedIn()" class="btn-group">
              <a routerLink="/login" class="btn btn-outline-primary btn-sm">Login</a>
              <a routerLink="/register" class="btn btn-primary btn-sm ms-2">Register</a>
            </div>
            <button *ngIf="isLoggedIn()" (click)="logout()" class="btn btn-outline-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-size: 1.5rem;
    }
  `]
})
export class HeaderComponent {
  currentUser = this.authService.currentUserValue;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}