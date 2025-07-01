import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="flex justify-center mt-4">
        <div class="card" style="width: 100%; max-width: 500px;">
          <div class="card-header">
            <h2 class="text-center font-bold" style="margin: 0;">Create Account</h2>
          </div>
          <div class="card-body">
            <div class="alert alert-danger" *ngIf="errorMessage">
              {{errorMessage}}
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input
                    type="text"
                    class="form-control"
                    formControlName="firstName"
                    [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                  First name is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Middle Name (Optional)</label>
                <input type="text" class="form-control" formControlName="middleName">
              </div>

              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input
                    type="text"
                    class="form-control"
                    formControlName="lastName"
                    [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                  Last name is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Username</label>
                <input
                    type="text"
                    class="form-control"
                    formControlName="username"
                    [class.is-invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                  Username is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    formControlName="password"
                    [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                  Password is required (minimum 6 characters)
                </div>
              </div>

              <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="registerForm.invalid || isLoading"
                  style="width: 100%;">
                {{isLoading ? 'Creating Account...' : 'Create Account'}}
              </button>
            </form>

            <p class="text-center mt-4">
              Already have an account? <a routerLink="/login">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error || 'Registration failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}