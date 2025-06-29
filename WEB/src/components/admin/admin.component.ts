import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting, CreateJobRequest, JobStatus } from '../../models/job.model';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <h1 class="text-2xl font-bold">
                  <span class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">Admin</span>
                  <span class="text-gray-900 ml-2">Portal</span>
                </h1>
              </div>
            </div>
            <div class="flex items-center space-x-6">
              <!-- CREATE JOB OFFER BUTTON IN NAVBAR -->
              <button
                  (click)="toggleCreateForm()"
                  class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Job Offer
              </button>

              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-white text-sm font-bold">
                    {{currentUser?.firstName?.charAt(0)}}{{currentUser?.lastName?.charAt(0)}}
                  </span>
                </div>
                <div class="text-left">
                  <p class="text-sm font-semibold text-gray-900">{{currentUser?.firstName}} {{currentUser?.lastName}}</p>
                  <p class="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <button (click)="logout()" class="modern-btn-danger">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="stats-card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Jobs</p>
                <p class="text-3xl font-bold text-gray-900">{{jobs.length}}</p>
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Applications</p>
                <p class="text-3xl font-bold text-gray-900">{{applications.length}}</p>
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5">
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Jobs</p>
                <p class="text-3xl font-bold text-gray-900">{{getActiveJobsCount()}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-8">
          <nav class="flex space-x-8 p-6">
            <button
                (click)="activeTab = 'jobs'"
                [class]="activeTab === 'jobs' ? 'nav-tab-modern active' : 'nav-tab-modern'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
              Job Postings
            </button>
            <button
                (click)="activeTab = 'applications'"
                [class]="activeTab === 'applications' ? 'nav-tab-modern active' : 'nav-tab-modern'">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Applications
            </button>
          </nav>
        </div>

        <!-- Create Job Form -->
        <div *ngIf="showCreateForm" class="modern-card p-8 mb-8 slide-up">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Create New Job Posting</h3>
          </div>

          <form (ngSubmit)="createJob()" #jobFormRef="ngForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="form-group">
                <label class="form-label">Job Title *</label>
                <input
                    type="text"
                    [(ngModel)]="newJobData.title"
                    name="title"
                    required
                    class="modern-input"
                    placeholder="e.g. Senior Software Developer">
              </div>
              <div class="form-group">
                <label class="form-label">Company *</label>
                <input
                    type="text"
                    [(ngModel)]="newJobData.company"
                    name="company"
                    required
                    class="modern-input"
                    placeholder="e.g. Tech Solutions Inc.">
              </div>
            </div>

            <div class="form-group mb-8">
              <label class="form-label">Job Description *</label>
              <textarea
                  [(ngModel)]="newJobData.description"
                  name="description"
                  required
                  class="modern-textarea"
                  rows="6"
                  placeholder="Describe the role, responsibilities, requirements, and benefits in detail..."></textarea>
            </div>

            <div class="flex justify-end space-x-4">
              <button
                  type="button"
                  (click)="cancelCreateForm()"
                  class="modern-btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button
                  type="submit"
                  [disabled]="creatingJob || !jobFormRef.valid"
                  class="modern-btn-success">
                <span *ngIf="creatingJob" class="modern-spinner mr-2"></span>
                <svg *ngIf="!creatingJob" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{creatingJob ? 'Creating Job...' : 'Create Job Posting'}}
              </button>
            </div>
          </form>
        </div>

        <!-- Jobs Tab -->
        <div *ngIf="activeTab === 'jobs'" class="fade-in">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Job Postings</h2>
              <p class="text-gray-600 text-lg">Manage and create job opportunities</p>
            </div>
            <button
                (click)="toggleCreateForm()"
                [class]="showCreateForm ? 'modern-btn-secondary' : 'modern-btn-primary'">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {{showCreateForm ? 'Cancel' : 'Create New Job'}}
            </button>
          </div>

          <!-- Jobs List -->
          <div *ngIf="jobs.length === 0 && !loading" class="empty-state-modern">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">No job postings yet</h3>
            <p class="text-gray-600 mb-8 text-lg">Get started by creating your first job posting to attract top talent.</p>
            <button (click)="showCreateForm = true" class="modern-btn-primary">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Your First Job
            </button>
          </div>

          <div class="grid gap-6" *ngIf="jobs.length > 0">
            <div *ngFor="let job of jobs" class="job-card">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-2xl font-bold text-gray-900">{{job.title}}</h3>
                    <span [class]="job.status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'">
                      {{job.status}}
                    </span>
                  </div>
                  <p class="text-lg font-semibold text-gray-700 mb-4">{{job.company}}</p>
                  <p class="text-gray-600 mb-6 leading-relaxed">{{job.description}}</p>
                  <div class="flex items-center space-x-8 text-sm text-gray-500">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      {{job.applicationCount}} applications
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2"></path>
                      </svg>
                      Posted {{formatDate(job.datePosted)}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                    (click)="viewJobApplications(job.id)"
                    class="modern-btn-secondary">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Applications
                </button>
                <button
                    (click)="toggleJobStatus(job)"
                    [class]="job.status === 'Active' ? 'modern-btn-warning' : 'modern-btn-success'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                  </svg>
                  {{job.status === 'Active' ? 'Deactivate' : 'Activate'}}
                </button>
                <button
                    (click)="deleteJob(job.id)"
                    class="modern-btn-danger">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Applications Tab -->
        <div *ngIf="activeTab === 'applications'" class="fade-in">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">All Applications</h2>
            <p class="text-gray-600 text-lg">Review and manage job applications from candidates</p>
          </div>

          <div *ngIf="applications.length === 0 && !loading" class="empty-state-modern">
            <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">No applications yet</h3>
            <p class="text-gray-600 text-lg">Applications will appear here once users start applying for jobs.</p>
          </div>

          <div class="grid gap-6" *ngIf="applications.length > 0">
            <div *ngFor="let application of applications" class="application-card">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-2xl font-bold text-gray-900">{{application.jobTitle}}</h3>
                    <span [class]="getStatusClass(application.status)">
                      {{getStatusDisplay(application.status)}}
                    </span>
                  </div>
                  <p class="text-lg font-semibold text-gray-700 mb-2">{{application.company}}</p>
                  <div class="flex items-center space-x-8 text-sm text-gray-500 mb-4">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {{application.userName}}
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2"></path>
                      </svg>
                      Applied {{formatDate(application.submittedAt)}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end pt-6 border-t border-gray-100">
                <div class="flex items-center space-x-4">
                  <label class="text-sm font-semibold text-gray-700">Update Status:</label>
                  <select
                      (change)="updateApplicationStatus(application.id, $event)"
                      [value]="application.status"
                      class="modern-select">
                    <option value="Submitted">Submitted</option>
                    <option value="SelectedForInterview">Selected for Interview</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-16">
          <div class="modern-spinner-large mx-auto mb-6"></div>
          <p class="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeTab = 'jobs';
  jobs: JobPosting[] = [];
  applications: Application[] = [];
  showCreateForm = false;
  creatingJob = false;
  loading = true;
  currentUser = this.authService.getCurrentUser();

  newJobData: CreateJobRequest = {
    title: '',
    company: '',
    description: ''
  };

  constructor(
      private jobService: JobService,
      private applicationService: ApplicationService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadApplications();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  cancelCreateForm(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newJobData = {
      title: '',
      company: '',
      description: ''
    };
  }

  createJob(): void {
    if (!this.newJobData.title || !this.newJobData.company || !this.newJobData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    this.creatingJob = true;

    this.jobService.createJob(this.newJobData).subscribe({
      next: (job) => {
        this.jobs.unshift(job);
        this.resetForm();
        this.showCreateForm = false;
        this.creatingJob = false;
        // Show success message
        alert('Job posting created successfully!');
      },
      error: (error) => {
        console.error('Error creating job:', error);
        alert('Failed to create job. Please try again.');
        this.creatingJob = false;
      }
    });
  }

  toggleJobStatus(job: JobPosting): void {
    const newStatus = job.status === JobStatus.Active ? JobStatus.Inactive : JobStatus.Active;

    this.jobService.updateJob(job.id, { status: newStatus }).subscribe({
      next: () => {
        job.status = newStatus;
      },
      error: (error) => {
        console.error('Error updating job status:', error);
        alert('Failed to update job status. Please try again.');
      }
    });
  }

  deleteJob(jobId: number): void {
    if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      this.jobService.deleteJob(jobId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(j => j.id !== jobId);
          alert('Job posting deleted successfully.');
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          alert('Failed to delete job. Please try again.');
        }
      });
    }
  }

  viewJobApplications(jobId: number): void {
    this.applicationService.getApplicationsByJob(jobId).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.activeTab = 'applications';
      },
      error: (error) => {
        console.error('Error loading job applications:', error);
        alert('Failed to load applications. Please try again.');
      }
    });
  }

  updateApplicationStatus(applicationId: number, event: any): void {
    const status = event.target.value as ApplicationStatus;

    this.applicationService.updateApplicationStatus(applicationId, { status }).subscribe({
      next: () => {
        const application = this.applications.find(a => a.id === applicationId);
        if (application) {
          application.status = status;
        }
      },
      error: (error) => {
        console.error('Error updating application status:', error);
        alert('Failed to update application status. Please try again.');
      }
    });
  }

  getStatusClass(status: ApplicationStatus): string {
    const baseClass = 'status-badge-modern ';
    switch (status) {
      case ApplicationStatus.Submitted:
        return baseClass + 'status-submitted';
      case ApplicationStatus.SelectedForInterview:
        return baseClass + 'status-interview';
      case ApplicationStatus.Rejected:
        return baseClass + 'status-rejected';
      default:
        return baseClass + 'status-submitted';
    }
  }

  getStatusDisplay(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.Submitted:
        return 'Submitted';
      case ApplicationStatus.SelectedForInterview:
        return 'Interview';
      case ApplicationStatus.Rejected:
        return 'Rejected';
      default:
        return status;
    }
  }

  getActiveJobsCount(): number {
    return this.jobs.filter(job => job.status === JobStatus.Active).length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}