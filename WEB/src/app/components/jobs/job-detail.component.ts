import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="job-detail-container">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Loading job details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!loading && !job" class="error-container">
        <div class="error-card">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3>Job Not Found</h3>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <a routerLink="/jobs" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Jobs
          </a>
        </div>
      </div>

      <!-- Job Detail Content -->
      <div *ngIf="job" class="job-detail-content">
        <!-- Header Section -->
        <div class="job-header">
          <div class="job-header-content">
            <div class="job-title-section">
              <h1 class="job-title">{{ job.title }}</h1>
              <h2 class="company-name">{{ job.companyName }}</h2>
              <div class="job-meta">
                <div class="meta-item">
                  <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l.01.01M6 20v-2a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>Published {{ job.publishedDate | date:'MMM d, y' }}</span>
                </div>
                <div class="meta-item">
                  <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span>{{ job.applicationsCount }} application{{ job.applicationsCount !== 1 ? 's' : '' }}</span>
                </div>
                <div class="meta-item">
                  <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>Posted by {{ job.createdByName }}</span>
                </div>
              </div>
            </div>
            <div class="job-status-section">
              <span class="status-badge" [ngClass]="getStatusClass(job.status)">
                {{ job.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Job Description -->
        <div class="job-description-section">
          <div class="section-card">
            <h3 class="section-title">Job Description</h3>
            <div class="job-description">{{ job.description }}</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <div class="action-buttons">
            <a routerLink="/jobs" class="btn btn-outline">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Jobs
            </a>

            <!-- User Actions -->
            <div *ngIf="isUser() && job.status === 'Active'" class="apply-section">
              <button
                  *ngIf="!hasApplied && !applyLoading"
                  (click)="applyForJob()"
                  class="btn btn-success">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Apply for this Job
              </button>

              <button
                  *ngIf="applyLoading"
                  disabled
                  class="btn btn-success">
                <div class="spinner-sm"></div>
                Applying...
              </button>

              <div *ngIf="hasApplied" class="applied-status">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Application Submitted</span>
              </div>
            </div>

            <!-- Admin Actions -->
            <div *ngIf="isAdmin()" class="admin-actions">
              <a [routerLink]="['/admin/jobs', job.id, 'edit']" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Job
              </a>
            </div>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div *ngIf="successMessage" class="message-container">
          <div class="success-message">
            <svg class="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ successMessage }}
          </div>
        </div>

        <div *ngIf="errorMessage" class="message-container">
          <div class="error-message">
            <svg class="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Loading and Error States */
    .loading-container,
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .loading-spinner,
    .error-card {
      text-align: center;
      padding: 2rem;
    }

    .error-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-width: 400px;
    }

    .loading-text {
      margin-top: 1rem;
      color: #6b7280;
      font-size: 1.125rem;
    }

    .error-icon {
      width: 4rem;
      height: 4rem;
      color: #ef4444;
      margin: 0 auto 1rem;
    }

    .error-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .error-card p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    /* Job Header */
    .job-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      color: white;
    }

    .job-header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
    }

    .job-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    .company-name {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .meta-icon {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }

    .job-status-section {
      flex-shrink: 0;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .status-inactive {
      background-color: rgba(239, 68, 68, 0.2);
      color: #fecaca;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Job Description Section */
    .job-description-section {
      margin-bottom: 2rem;
    }

    .section-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .job-description {
      white-space: pre-wrap;
      line-height: 1.7;
      color: #374151;
      font-size: 1rem;
    }

    /* Action Section */
    .action-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .apply-section,
    .admin-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .applied-status {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background-color: #d1fae5;
      color: #065f46;
      border-radius: 0.5rem;
      font-weight: 500;
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
    .message-container {
      margin-bottom: 1rem;
    }

    .success-message,
    .error-message {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 500;
    }

    .success-message {
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .error-message {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
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
      .job-header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .job-title {
        font-size: 2rem;
      }

      .company-name {
        font-size: 1.25rem;
      }

      .job-meta {
        flex-direction: column;
        gap: 0.75rem;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .apply-section,
      .admin-actions {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .job-header {
        padding: 1.5rem;
      }

      .section-card,
      .action-section {
        padding: 1.5rem;
      }

      .job-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: JobPosting | null = null;
  loading = true;
  hasApplied = false;
  applyLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private jobService: JobService,
      private applicationService: ApplicationService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadJob(id);

    if (this.isUser()) {
      this.checkIfApplied(id);
    }
  }

  loadJob(id: number): void {
    this.jobService.getJob(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.loading = false;
      }
    });
  }

  checkIfApplied(jobId: number): void {
    this.applicationService.checkIfApplied(jobId).subscribe({
      next: (applied) => {
        this.hasApplied = applied;
      },
      error: (error) => {
        console.error('Error checking application status:', error);
      }
    });
  }

  applyForJob(): void {
    if (!this.job) return;

    this.applyLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationService.applyForJob(this.job.id).subscribe({
      next: (application) => {
        this.applyLoading = false;
        this.hasApplied = true;
        this.successMessage = 'Application submitted successfully! We\'ll be in touch soon.';

        // Update applications count
        if (this.job) {
          this.job.applicationsCount++;
        }
      },
      error: (error) => {
        this.applyLoading = false;
        this.errorMessage = error.error || 'Failed to submit application. Please try again.';
      }
    });
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  isUser(): boolean {
    const user = this.authService.currentUserValue;
    return user?.role === 'User';
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}