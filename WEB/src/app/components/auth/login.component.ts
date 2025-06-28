import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card">
            <div class="card-header text-center">
              <h2 class="mb-1">Login</h2>
              <small class="text-muted">Use admin/admin123 for admin access</small>
            </div>
            <div class="card-body">
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input
                      type="text"
                      class="form-control"
                      formControlName="username"
                      placeholder="Enter username">
                  <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="text-danger small mt-1">
                    Username is required
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                      type="password"
                      class="form-control"
                      formControlName="password"
                      placeholder="Enter password">
                  <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-danger small mt-1">
                    Password is required
                  </div>
                </div>

                <button
                    type="submit"
                    class="btn btn-primary w-100"
                    [disabled]="loginForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </form>
            </div>
            <div class="card-footer text-center">
              <small>Don't have an account? <a routerLink="/register">Register here</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding-top: 3rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/jobs']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.user.role === 'Admin') {
            this.router.navigate(['/admin/jobs']);
          } else {
            this.router.navigate(['/jobs']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}