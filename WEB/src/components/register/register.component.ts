import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-lg w-full">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div class="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8 relative z-10">
          <div class="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Join as Job Seeker
          </h2>
          <p class="text-lg text-gray-600 font-medium">
            Create your account and start finding opportunities
          </p>
        </div>

        <!-- Register Form -->
        <div class="relative z-10">
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
            <form class="space-y-6" (ngSubmit)="onSubmit()" #registerFormRef="ngForm">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-emerald-600 transition-colors">
                    First Name *
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        [(ngModel)]="registerData.firstName"
                        class="modern-input pl-12"
                        placeholder="John">
                  </div>
                </div>
                <div class="group">
                  <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-emerald-600 transition-colors">
                    Last Name *
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        [(ngModel)]="registerData.lastName"
                        class="modern-input pl-12"
                        placeholder="Doe">
                  </div>
                </div>
              </div>

              <div class="group">
                <label for="middleName" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-emerald-600 transition-colors">
                  Middle Name
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                      id="middleName"
                      name="middleName"
                      type="text"
                      [(ngModel)]="registerData.middleName"
                      class="modern-input pl-12"
                      placeholder="Optional">
                </div>
              </div>

              <div class="group">
                <label for="username" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-emerald-600 transition-colors">
                  Username *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"></path>
                    </svg>
                  </div>
                  <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      [(ngModel)]="registerData.username"
                      class="modern-input pl-12"
                      placeholder="Choose a unique username">
                </div>
              </div>

              <div class="group">
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-emerald-600 transition-colors">
                  Password *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minlength="6"
                      [(ngModel)]="registerData.password"
                      class="modern-input pl-12"
                      placeholder="Minimum 6 characters">
                </div>
                <p class="mt-2 text-xs text-gray-500 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Password must be at least 6 characters long
                </p>
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
                  [disabled]="loading || !registerFormRef.valid"
                  class="modern-btn-success w-full group">
                <span *ngIf="loading" class="modern-spinner mr-3"></span>
                <svg *ngIf="!loading" class="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                {{loading ? 'Creating your account...' : 'Create Job Seeker Account'}}
              </button>
            </form>

            <!-- Info Box -->
            <div class="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h4 class="text-sm font-bold text-emerald-900 mb-2">Job Seeker Account</h4>
                  <div class="text-sm text-emerald-800 space-y-1">
                    <p>• Browse and apply for job opportunities</p>
                    <p>• Upload your resume for applications</p>
                    <p>• Track your application status</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Login Link -->
            <div class="mt-8 text-center">
              <p class="text-gray-600">
                Already have an account?
                <button (click)="switchToLogin()" class="font-bold text-emerald-600 hover:text-emerald-500 ml-2 hover:underline transition-all duration-200">
                  Sign in here →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    middleName: '',
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

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error || 'Registration failed. Please try again.';
      }
    });
  }

  switchToLogin(): void {
    this.router.navigate(['/login']);
  }
}