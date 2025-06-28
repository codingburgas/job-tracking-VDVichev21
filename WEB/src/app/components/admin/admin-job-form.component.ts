import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-admin-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="job-form-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-text">
            <h1 class="main-title">{{ isEditMode ? 'Edit Job Posting' : 'Create New Job Posting' }}</h1>
            <p class="subtitle">{{ isEditMode ? 'Update job details and requirements' : 'Fill in the details to post a new job opportunity' }}</p>
          </div>
          <div class="header-actions">
            <a routerLink="/admin/jobs" class="btn btn-outline">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Jobs
            </a>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <div class="form-card">
          <div class="form-header">
            <h3>Job Information</h3>
            <p>Provide detailed information about the job position</p>
          </div>

          <div class="form-body">
            <div *ngIf="errorMessage" class="error-message">
              <svg class="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              {{ errorMessage }}
            </div>

            <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                    </svg>
                    Job Title
                  </label>
                  <input
                      type="text"
                      class="form-input"
                      formControlName="title"
                      placeholder="e.g. Senior Software Developer">
                  <div *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched" class="field-error">
                    Job title is required
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Company Name
                  </label>
                  <input
                      type="text"
                      class="form-input"
                      formControlName="companyName"
                      placeholder="e.g. Tech Solutions Inc.">
                  <div *ngIf="jobForm.get('companyName')?.invalid && jobForm.get('companyName')?.touched" class="field-error">
                    Company name is required
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Job Description
                </label>
                <textarea
                    class="form-input form-textarea"
                    formControlName="description"
                    placeholder="Provide a detailed description of the job including responsibilities, requirements, qualifications, and any other relevant information..."
                    rows="8"></textarea>
                <div *ngIf="jobForm.get('description')?.invalid && jobForm.get('description')?.touched" class="field-error">
                  Job description is required
                </div>
                <div class="form-hint">
                  Include responsibilities, requirements, qualifications, and benefits
                </div>
              </div>

              <div *ngIf="isEditMode" class="form-group">
                <label class="form-label">
                  <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Status
                </label>
                <select class="form-input" formControlName="status">
                  <option value="Active">Active - Visible to job seekers</option>
                  <option value="Inactive">Inactive - Hidden from job seekers</option>
                </select>
              </div>

              <div class="form-actions">
                <a routerLink="/admin/jobs" class="btn btn-outline">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Cancel
                </a>
                <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="jobForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-sm"></span>
                  <svg *ngIf="!loading" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Create Job') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Header Section */
    .header-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 1rem;
      padding: 3rem 2rem;
      margin-bottom: 2rem;
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 1.125rem;
      opacity: 0.9;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }

    /* Form Section */
    .form-section {
      margin-bottom: 2rem;
    }

    .form-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .form-header {
      padding: 2rem 2rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .form-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #6b7280;
      margin: 0;
    }

    .form-body {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .label-icon {
      width: 1rem;
      height: 1rem;
      color: #6b7280;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 150px;
      line-height: 1.6;
    }

    .form-hint {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .field-error {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #ef4444;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .spinner-sm {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #ffffff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }

    /* Messages */
    .error-message {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      background-color: #fee2e2;
      color: #991b1b;
      border-radius: 0.75rem;
      border: 1px solid #fecaca;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .message-icon {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    /* Utility Classes */
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    .w-5 { width: 1.25rem; }
    .h-5 { height: 1.25rem; }
    .mr-2 { margin-right: 0.5rem; }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .main-title {
        font-size: 2rem;
      }

      .header-actions {
        width: 100%;
        justify-content: center;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
      }
    }

    @media (max-width: 480px) {
      .header-section {
        padding: 2rem 1rem;
      }

      .form-body {
        padding: 1.5rem;
      }

      .form-header {
        padding: 1.5rem;
      }
    }
  `]
})
export class AdminJobFormComponent implements OnInit {
  jobForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  jobId: number | null = null;

  constructor(
      private fb: FormBuilder,
      private jobService: JobService,
      private route: ActivatedRoute,
      private router: Router
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Active']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJob(this.jobId);
    }
  }

  loadJob(id: number): void {
    this.jobService.getJob(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          companyName: job.companyName,
          description: job.description,
          status: job.status
        });
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.errorMessage = 'Failed to load job details.';
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.jobForm.value;
      console.log('Submitting job data:', formData);

      if (this.isEditMode && this.jobId) {
        this.jobService.updateJob(this.jobId, formData).subscribe({
          next: (job) => {
            console.log('Job updated successfully:', job);
            this.loading = false;
            this.router.navigate(['/admin/jobs']);
          },
          error: (error) => {
            console.error('Error updating job:', error);
            this.loading = false;
            this.errorMessage = 'Failed to update job. Please try again.';
          }
        });
      } else {
        this.jobService.createJob(formData).subscribe({
          next: (job) => {
            console.log('Job created successfully:', job);
            this.loading = false;
            this.router.navigate(['/admin/jobs']);
          },
          error: (error) => {
            console.error('Error creating job:', error);
            this.loading = false;
            this.errorMessage = 'Failed to create job. Please try again.';
          }
        });
      }
    } else {
      console.log('Form is invalid:', this.jobForm.errors);
      Object.keys(this.jobForm.controls).forEach(key => {
        const control = this.jobForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
          control.markAsTouched();
        }
      });
    }
  }
}