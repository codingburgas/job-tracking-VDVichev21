import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // 🔥 FIXED: Redirect admins to admin dashboard if they try to access user routes
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
        return false;
      }
      return true; // Allow regular users to access user routes
    }

    this.router.navigate(['/login']);
    return false;
  }
}