import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <a routerLink="/" class="navbar-brand">JobTracker</a>

          <ul class="navbar-nav" *ngIf="currentUser">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Browse Jobs</a></li>
            <li><a routerLink="/my-jobs" routerLinkActive="active" class="nav-link">My Jobs</a></li>
            <li><a routerLink="/my-applications" routerLinkActive="active" class="nav-link">My Applications</a></li>
            <li><a routerLink="/received-applications" routerLinkActive="active" class="nav-link">Received Applications</a></li>
            <li>
              <span class="nav-link">Welcome, {{currentUser.firstName}}</span>
            </li>
            <li>
              <button (click)="logout()" class="btn btn-secondary">Logout</button>
            </li>
          </ul>

          <ul class="navbar-nav" *ngIf="!currentUser">
            <li><a routerLink="/login" routerLinkActive="active" class="nav-link">Login</a></li>
            <li><a routerLink="/register" routerLinkActive="active" class="nav-link">Register</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}