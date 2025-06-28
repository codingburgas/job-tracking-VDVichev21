import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-header text-center">
              <h2 class="mb-0">Register</h2>
            </div>
            <div class="card-body">
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input
                        type="text"
                        class="form-control"
                        formControlName="firstName"
                        placeholder="First name">
                    <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="text-danger small mt-1">
                      Required
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input
                        type="text"
                        class="form-control"
                        formControlName="lastName"
                        placeholder="Last name">
                    <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="text-danger small mt-1">
                      Required
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Middle Name (Optional)</label>
                  <input
                      type="text"
                      class="form-control"
                      formControlName="middleName"
                      placeholder="Middle name">
                </div>

                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input
                      type="text"
                      class="form-control"
                      formControlName="username"
                      placeholder="Choose username">
                  <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="text-danger small mt-1">
                    Required
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                      type="password"
                      class="form-control"
                      formControlName="password"
                      placeholder="Password (min 6 characters)">
                  <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-danger small mt-1">
                    <div *ngIf="registerForm.get('password')?.errors?.['required']">Required</div>
                    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Min 6 characters</div>
                  </div>
                </div>

                <button
                    type="submit"
                    class="btn btn-primary w-100"
                    [disabled]="registerForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Registering...' : 'Register' }}
                </button>
              </form>
            </div>
            <div class="card-footer text-center">
              <small>Already have an account? <a routerLink="/login">Login here</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding-top: 2rem;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

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
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Registration successful! You can now login.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    }
  }
}