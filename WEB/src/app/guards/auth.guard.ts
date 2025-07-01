import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('🔐 AuthGuard: Checking authentication...');

    const isAuthenticated = this.authService.isAuthenticated();
    const currentUser = this.authService.getCurrentUser();
    const token = this.authService.getToken();

    console.log('🔐 AuthGuard: Authenticated:', isAuthenticated);
    console.log('🔐 AuthGuard: Current user:', currentUser?.username || 'None');
    console.log('🔐 AuthGuard: Token exists:', !!token);

    if (isAuthenticated) {
      console.log('✅ AuthGuard: Access granted');
      return true;
    }

    console.log('❌ AuthGuard: Access denied, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}