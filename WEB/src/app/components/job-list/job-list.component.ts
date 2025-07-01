import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Browse Jobs</h1>
        <p>Find your next opportunity</p>

        <div class="flex gap-2 justify-center mt-4" *ngIf="authService.isAuthenticated()">
          <a routerLink="/my-jobs/new" class="btn btn-primary">
            📝 Post a New Job
          </a>
          <button (click)="refreshJobs()" class="btn btn-secondary">
            🔄 Refresh Jobs
          </button>
        </div>

        <div class="text-center mt-4" *ngIf="!authService.isAuthenticated()">
          <p>Please <a routerLink="/login">login</a> or <a routerLink="/register">register</a> to post jobs or apply for positions</p>
          <button (click)="refreshJobs()" class="btn btn-secondary">
            🔄 Refresh Jobs
          </button>
        </div>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading job opportunities...</p>
      </div>

      <div class="empty-state" *ngIf="!isLoading && jobs.length === 0">
        <h3>No jobs available yet</h3>
        <p>Be the first to post a job opportunity!</p>
        <a routerLink="/my-jobs/new" class="btn btn-primary" *ngIf="authService.isAuthenticated()">Post the First Job</a>
        <a routerLink="/register" class="btn btn-primary" *ngIf="!authService.isAuthenticated()">Register to Post Jobs</a>
      </div>

      <div class="grid grid-cols-1" *ngIf="!isLoading && jobs.length > 0">
        <div class="card" *ngFor="let job of jobs; trackBy: trackByJobId">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold" style="margin: 0; color: #1e293b;">{{job.title}}</h3>
              <div class="flex gap-2 items-center">
                <span class="badge badge-success" *ngIf="job.status === 'Active'">Active</span>
                <span class="badge badge-secondary" *ngIf="job.status === 'Inactive'">Inactive</span>
                <span class="text-xs text-gray-500" *ngIf="job.canEdit">(Your Job)</span>
              </div>
            </div>

            <p class="font-semibold text-gray-600 mb-2">{{job.companyName}}</p>
            <p class="text-sm text-gray-500 mb-4">Posted by: {{job.postedByUserName}}</p>

            <p class="text-gray-600 mb-4" style="line-height: 1.6;">{{job.description}}</p>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Posted: {{formatDate(job.datePosted)}}
              </span>

              <div class="flex gap-2">
                <button
                    *ngIf="authService.isAuthenticated() && !job.canEdit"
                    (click)="openApplyModal(job.id)"
                    class="btn btn-primary"
                    [disabled]="isApplying">
                  Apply Now
                </button>

                <a
                    *ngIf="job.canEdit"
                    [routerLink]="['/my-jobs', job.id, 'edit']"
                    class="btn btn-secondary">
                  Edit
                </a>

                <a
                    *ngIf="!authService.isAuthenticated()"
                    routerLink="/login"
                    class="btn btn-primary">
                  Login to Apply
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Apply Modal -->
      <div class="modal-overlay" *ngIf="showApplyModal" (click)="closeApplyModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Apply for Job</h3>
            <button class="modal-close" (click)="closeApplyModal()">&times;</button>
          </div>
          <div class="modal-body">
            <p class="mb-4">Upload your resume (PDF format only, max 5MB):</p>

            <div class="file-upload-area"
                 [class.dragover]="isDragOver"
                 (dragover)="onDragOver($event)"
                 (dragleave)="onDragLeave($event)"
                 (drop)="onDrop($event)"
                 (click)="fileInput.click()">
              <div class="file-upload-content">
                <div class="file-upload-icon">📄</div>
                <p *ngIf="!selectedFile">Click to select or drag and drop your PDF resume</p>
                <p *ngIf="selectedFile" class="selected-file">
                  Selected: {{selectedFile.name}}
                  <span class="file-size">({{formatFileSize(selectedFile.size)}})</span>
                </p>
              </div>
              <input #fileInput type="file" accept=".pdf" (change)="onFileSelected($event)" style="display: none;">
            </div>

            <div class="alert alert-danger" *ngIf="fileError">
              {{fileError}}
            </div>

            <div class="flex gap-2 mt-4">
              <button
                  (click)="submitApplication()"
                  class="btn btn-primary"
                  [disabled]="isApplying">
                {{isApplying ? 'Submitting...' : 'Submit Application'}}
              </button>
              <button (click)="closeApplyModal()" class="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div class="alert alert-success" *ngIf="successMessage">
        {{successMessage}}
      </div>

      <div class="alert alert-danger" *ngIf="errorMessage">
        {{errorMessage}}
      </div>

      <!-- Job Statistics -->
      <div class="mt-6 text-center" *ngIf="!isLoading">
        <p class="text-sm text-gray-500">
          Showing {{jobs.length}} job{{jobs.length !== 1 ? 's' : ''}} available
          <span *ngIf="authService.isAuthenticated()"> | Welcome back, {{authService.getCurrentUser()?.firstName}}!</span>
          <span *ngIf="!authService.isAuthenticated()"> | <a routerLink="/register">Register</a> to post jobs and apply</span>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 1rem;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h3 {
      margin: 0;
      font-weight: 600;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .file-upload-area {
      border: 2px dashed #cbd5e1;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #f8fafc;
    }

    .file-upload-area:hover,
    .file-upload-area.dragover {
      border-color: #2563eb;
      background: #eff6ff;
    }

    .file-upload-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .selected-file {
      color: #16a34a;
      font-weight: 500;
    }

    .file-size {
      color: #64748b;
      font-weight: normal;
      font-size: 0.875rem;
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: JobPosting[] = [];
  isLoading = true;
  isApplying = false;
  successMessage = '';
  errorMessage = '';

  showApplyModal = false;
  selectedJobId: number | null = null;
  selectedFile: File | null = null;
  fileError = '';
  isDragOver = false;

  constructor(
      private jobService: JobService,
      public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobService.getJobPostings().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load jobs';
        this.isLoading = false;
      }
    });
  }

  refreshJobs(): void {
    this.loadJobs();
  }

  trackByJobId(index: number, job: JobPosting): number {
    return job.id;
  }

  openApplyModal(jobId: number): void {
    this.selectedJobId = jobId;
    this.showApplyModal = true;
    this.selectedFile = null;
    this.fileError = '';
  }

  closeApplyModal(): void {
    this.showApplyModal = false;
    this.selectedJobId = null;
    this.selectedFile = null;
    this.fileError = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.validateAndSetFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  validateAndSetFile(file: File): void {
    this.fileError = '';

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF files are allowed';
      return;
    }

    if (file.size > 5 * 1024 * 1024) { 
      this.fileError = 'File size cannot exceed 5MB';
      return;
    }

    this.selectedFile = file;
  }

  submitApplication(): void {
    if (!this.selectedJobId) return;

    this.isApplying = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.jobService.applyForJob(this.selectedJobId, this.selectedFile).subscribe({
      next: () => {
        this.successMessage = 'Application submitted successfully!';
        this.closeApplyModal();
        this.isApplying = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to submit application';
        this.isApplying = false;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}