import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  canActivate(): boolean {
    // 🔥 FIXED: Proper admin guard logic
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true; // Allow access to admin routes
    }

    // If not admin but authenticated, redirect to jobs
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/jobs']);
      return false;
    }

    // If not authenticated, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}