import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-admin-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-job-list-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-text">
            <h1 class="main-title">Manage Job Postings</h1>
            <p class="subtitle">Create, edit, and manage all job postings</p>
          </div>
          <div class="admin-actions">
            <a routerLink="/admin/jobs/new" class="btn btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Post New Job
            </a>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-icon-total">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ jobs.length }}</div>
              <div class="stat-label">Total Jobs</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-active">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getActiveJobsCount() }}</div>
              <div class="stat-label">Active Jobs</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-applications">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ getTotalApplicationsCount() }}</div>
              <div class="stat-label">Total Applications</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Loading job postings...</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="error-container">
        <div class="error-card">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3>Error Loading Jobs</h3>
          <p>{{ errorMessage }}</p>
          <button (click)="loadJobs()" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !errorMessage && jobs.length === 0" class="empty-container">
        <div class="empty-card">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
          </svg>
          <h3>No Job Postings</h3>
          <p>You haven't created any job postings yet. Start by posting your first job!</p>
          <a routerLink="/admin/jobs/new" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Post Your First Job
          </a>
        </div>
      </div>

      <!-- Jobs Table -->
      <div *ngIf="!loading && !errorMessage && jobs.length > 0" class="jobs-table-section">
        <div class="table-card">
          <div class="table-header">
            <h3>All Job Postings</h3>
          </div>
          <div class="table-container">
            <table class="jobs-table">
              <thead>
              <tr>
                <th>Job Details</th>
                <th>Published</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let job of jobs; trackBy: trackByJobId" class="job-row">
                <td class="job-details-cell">
                  <div class="job-info">
                    <h4 class="job-title">{{ job.title }}</h4>
                    <p class="company-name">{{ job.companyName }}</p>
                  </div>
                </td>
                <td class="published-cell">
                  <div class="published-info">
                    <span class="published-date">{{ job.publishedDate | date:'MMM d, y' }}</span>
                    <span class="published-time">{{ job.publishedDate | date:'shortTime' }}</span>
                  </div>
                </td>
                <td class="status-cell">
                    <span class="status-badge" [ngClass]="getStatusClass(job.status)">
                      {{ job.status }}
                    </span>
                </td>
                <td class="applications-cell">
                  <div class="applications-count">
                    <span class="count-number">{{ job.applicationsCount }}</span>
                    <span class="count-label">application{{ job.applicationsCount !== 1 ? 's' : '' }}</span>
                  </div>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <a [routerLink]="['/jobs', job.id]" class="btn btn-outline btn-sm" title="View Job">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </a>
                    <a [routerLink]="['/admin/jobs', job.id, 'edit']" class="btn btn-secondary btn-sm" title="Edit Job">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </a>
                    <button (click)="deleteJob(job)" class="btn btn-danger btn-sm" title="Delete Job">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
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
    </div>
  `,
  styles: [`
    .admin-job-list-container {
      max-width: 1400px;
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

    .admin-actions {
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-icon-total {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .stat-icon-active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .stat-icon-applications {
      background-color: #fef3c7;
      color: #92400e;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    /* Loading, Error, Empty States */
    .loading-container,
    .error-container,
    .empty-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .loading-spinner,
    .error-card,
    .empty-card {
      text-align: center;
      padding: 2rem;
    }

    .error-card,
    .empty-card {
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

    .error-icon,
    .empty-icon {
      width: 4rem;
      height: 4rem;
      color: #6b7280;
      margin: 0 auto 1rem;
    }

    .error-card h3,
    .empty-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .error-card p,
    .empty-card p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    /* Jobs Table */
    .jobs-table-section {
      margin-bottom: 2rem;
    }

    .table-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .table-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .table-container {
      overflow-x: auto;
    }

    .jobs-table {
      width: 100%;
      border-collapse: collapse;
    }

    .jobs-table th {
      padding: 1rem 1.5rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      background-color: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .jobs-table td {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }

    .job-row:hover {
      background-color: #f9fafb;
    }

    .job-details-cell .job-info {
      display: flex;
      flex-direction: column;
    }

    .job-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .company-name {
      font-size: 0.875rem;
      color: #667eea;
      font-weight: 500;
      margin: 0;
    }

    .published-info {
      display: flex;
      flex-direction: column;
    }

    .published-date {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
    }

    .published-time {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .applications-count {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .count-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .count-label {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    /* Messages */
    .message-container {
      margin-bottom: 1rem;
    }

    .success-message {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      background-color: #d1fae5;
      color: #065f46;
      border-radius: 0.75rem;
      border: 1px solid #a7f3d0;
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

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .admin-actions {
        width: 100%;
        justify-content: center;
      }

      .table-container {
        font-size: 0.875rem;
      }

      .jobs-table th,
      .jobs-table td {
        padding: 0.75rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .header-section {
        padding: 2rem 1rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-icon {
        width: 2.5rem;
        height: 2.5rem;
      }

      .stat-number {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AdminJobListComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    console.log('Loading jobs...');
    this.loading = true;
    this.errorMessage = '';

    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Jobs loaded:', jobs);
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.errorMessage = 'Failed to load jobs. Please try again.';
        this.loading = false;
      }
    });
  }

  deleteJob(job: JobPosting): void {
    if (confirm(`Are you sure you want to delete the job "${job.title}"?`)) {
      this.jobService.deleteJob(job.id).subscribe({
        next: () => {
          this.successMessage = 'Job deleted successfully!';
          this.loadJobs(); // Reload the list
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          this.errorMessage = 'Failed to delete job. Please try again.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  getActiveJobsCount(): number {
    return this.jobs.filter(job => job.status === 'Active').length;
  }

  getTotalApplicationsCount(): number {
    return this.jobs.reduce((total, job) => total + job.applicationsCount, 0);
  }

  trackByJobId(index: number, job: JobPosting): number {
    return job.id;
  }
}