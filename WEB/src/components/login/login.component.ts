import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div class="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8 relative z-10">
          <div class="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
            </svg>
          </div>
          <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Welcome to Job Portal
          </h2>
          <p class="text-lg text-gray-600 font-medium">
            Sign in to continue your journey
          </p>
        </div>

        <!-- Login Form -->
        <div class="relative z-10">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
            <form class="space-y-6" (ngSubmit)="onSubmit()" #loginFormRef="ngForm">
              <div class="space-y-6">
                <div class="group">
                  <label for="username" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-indigo-600 transition-colors">
                    Username
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        [(ngModel)]="loginData.username"
                        class="modern-input pl-12"
                        placeholder="Enter your username">
                  </div>
                </div>

                <div class="group">
                  <label for="password" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-indigo-600 transition-colors">
                    Password
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        [(ngModel)]="loginData.password"
                        class="modern-input pl-12"
                        placeholder="Enter your password">
                  </div>
                </div>
              </div>

              <div *ngIf="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700 font-medium">{{ error }}</p>
                  </div>
                </div>
              </div>

              <button
                  type="submit"
                  [disabled]="loading || !loginFormRef.valid"
                  class="modern-btn-primary w-full group">
                <span *ngIf="loading" class="modern-spinner mr-3"></span>
                <svg *ngIf="!loading" class="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-6 0a4 4 0 01-4 4H7a4 4 0 01-4-4z"></path>
                </svg>
                {{loading ? 'Signing you in...' : 'Sign In'}}
              </button>
            </form>

            <!-- Demo Account Info -->
            <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-bold text-blue-900 mb-2">Demo Accounts</h4>
                  <div class="text-sm text-blue-800 space-y-1">
                    <p><span class="font-semibold">Employer:</span> admin / admin123</p>
                    <p><span class="font-semibold">Job Seeker:</span> Create a new account below</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Register Link -->
            <div class="mt-8 text-center">
              <p class="text-gray-600">
                Looking for opportunities?
                <button (click)="switchToRegister()" class="font-bold text-indigo-600 hover:text-indigo-500 ml-2 hover:underline transition-all duration-200">
                  Create Job Seeker Account →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.loading = false;
        // 🔥 FIXED: Proper routing based on user role
        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin']); // Admin goes to admin dashboard
        } else {
          this.router.navigate(['/jobs']); // Regular users go to job listings
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Invalid username or password. Please try again.';
      }
    });
  }

  switchToRegister(): void {
    this.router.navigate(['/register']);
  }
}