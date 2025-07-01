import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="flex justify-center mt-4">
        <div class="card" style="width: 100%; max-width: 400px;">
          <div class="card-header">
            <h2 class="text-center font-bold" style="margin: 0;">Login</h2>
          </div>
          <div class="card-body">
            <div class="alert alert-info" *ngIf="!errorMessage && !isLoading">
              <h4>Welcome to Job Tracker!</h4>
              <p>Please login with your account or <a routerLink="/register">create a new account</a> to get started.</p>
              <small>No demo accounts available - you'll need to register first!</small>
            </div>

            <div class="alert alert-danger" *ngIf="errorMessage">
              {{errorMessage}}
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Username</label>
                <input
                    type="text"
                    class="form-control"
                    formControlName="username"
                    placeholder="Enter your username"
                    [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                  Username is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    formControlName="password"
                    placeholder="Enter your password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  Password is required
                </div>
              </div>

              <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="loginForm.invalid || isLoading"
                  style="width: 100%;">
                {{isLoading ? 'Logging in...' : 'Login'}}
              </button>
            </form>

            <p class="text-center mt-4">
              Don't have an account? <a routerLink="/register">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
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
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error || 'Login failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}