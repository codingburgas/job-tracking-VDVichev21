import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-job-list',
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
                  <span class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">Job</span>
                  <span class="text-gray-900 ml-2">Portal</span>
                </h1>
              </div>
            </div>
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span class="text-white text-sm font-bold">
                    {{currentUser?.firstName?.charAt(0)}}{{currentUser?.lastName?.charAt(0)}}
                  </span>
                </div>
                <div class="text-left">
                  <p class="text-sm font-semibold text-gray-900">{{currentUser?.firstName}} {{currentUser?.lastName}}</p>
                  <p class="text-xs text-gray-500">Job Seeker</p>
                </div>
              </div>
              <button (click)="viewMyApplications()" class="modern-btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                My Applications
              </button>
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
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exciting opportunities from top companies and take the next step in your career journey.
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-16">
          <div class="modern-spinner-large mx-auto mb-6"></div>
          <p class="text-gray-600 text-lg">Loading available positions...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && jobs.length === 0" class="empty-state-modern">
          <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">No jobs available</h3>
          <p class="text-gray-600 text-lg">Check back later for new opportunities.</p>
        </div>

        <!-- Jobs Grid -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3" *ngIf="!loading && jobs.length > 0">
          <div *ngFor="let job of jobs" class="job-card">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-3">{{job.title}}</h3>
                <p class="text-lg font-semibold text-gray-700 mb-2">{{job.company}}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2"></path>
                  </svg>
                  Posted {{formatDate(job.datePosted)}}
                </div>
              </div>
            </div>

            <p class="text-gray-700 mb-8 leading-relaxed">{{job.description}}</p>

            <div class="flex items-center justify-between pt-6 border-t border-gray-100">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {{job.applicationCount}} applicants
              </div>

              <!-- APPLY NOW BUTTON - PROMINENT AND VISIBLE -->
              <button
                  *ngIf="!job.userHasApplied"
                  (click)="openApplicationModal(job)"
                  [disabled]="applying === job.id"
                  class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="applying === job.id" class="modern-spinner mr-2"></span>
                <svg *ngIf="applying !== job.id" class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{applying === job.id ? 'Applying...' : 'APPLY NOW'}}
              </button>

              <div *ngIf="job.userHasApplied" class="flex items-center text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Applied ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Modal -->
    <div *ngIf="showApplicationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Apply for Position</h3>
            <p class="text-gray-600">{{selectedJob?.title}} at {{selectedJob?.company}}</p>
          </div>
        </div>

        <form (ngSubmit)="submitApplication()" #applicationForm="ngForm">
          <div class="mb-6">
            <label class="form-label">Upload Resume (PDF) *</label>
            <div class="mt-2">
              <input
                  type="file"
                  accept=".pdf"
                  (change)="onFileSelected($event)"
                  required
                  class="hidden"
                  #fileInput>
              <div
                  (click)="fileInput.click()"
                  class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-gray-600 font-medium" *ngIf="!selectedFile">
                  Click to upload your resume
                </p>
                <p class="text-blue-600 font-medium" *ngIf="selectedFile">
                  {{selectedFile.name}}
                </p>
                <p class="text-xs text-gray-500 mt-2">PDF files only, max 5MB</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
                type="button"
                (click)="closeApplicationModal()"
                class="modern-btn-secondary">
              Cancel
            </button>
            <button
                type="submit"
                [disabled]="applying || !selectedFile"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="applying" class="modern-spinner mr-2"></span>
              {{applying ? 'Submitting...' : 'Submit Application'}}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
  jobs: JobPosting[] = [];
  loading = true;
  applying: number | null = null;
  currentUser = this.authService.getCurrentUser();
  showApplicationModal = false;
  selectedJob: JobPosting | null = null;
  selectedFile: File | null = null;

  constructor(
      private jobService: JobService,
      private applicationService: ApplicationService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
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

  openApplicationModal(job: JobPosting): void {
    this.selectedJob = job;
    this.showApplicationModal = true;
    this.selectedFile = null;
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
    this.selectedJob = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('File size must be less than 5MB.');
        return;
      }
      this.selectedFile = file;
    }
  }

  submitApplication(): void {
    if (!this.selectedJob || !this.selectedFile) {
      return;
    }

    this.applying = this.selectedJob.id;

    this.applicationService.createApplication({
      jobPostingId: this.selectedJob.id,
      resumeFile: this.selectedFile
    }).subscribe({
      next: () => {
        this.applying = null;
        // Update the job to show as applied
        const job = this.jobs.find(j => j.id === this.selectedJob!.id);
        if (job) {
          job.userHasApplied = true;
          job.applicationCount++;
        }
        this.closeApplicationModal();
        alert('Application submitted successfully! The employer will review your application.');
      },
      error: (error) => {
        this.applying = null;
        const errorMessage = error.error || 'Failed to apply for job. Please try again.';
        alert(errorMessage);
      }
    });
  }

  viewMyApplications(): void {
    this.router.navigate(['/applications']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}