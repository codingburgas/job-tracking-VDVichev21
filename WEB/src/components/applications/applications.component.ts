import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Application, ApplicationStatus } from '../../models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20">
            <div class="flex items-center">
              <button (click)="goBack()" class="modern-btn-secondary mr-6">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Jobs
              </button>
              <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>
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
            Your Applications
          </h2>
          <p class="text-xl text-gray-600 leading-relaxed">
            Track the status of your job applications and stay updated on your progress.
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-16">
          <div class="modern-spinner-large mx-auto mb-6"></div>
          <p class="text-gray-600 text-lg">Loading your applications...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && applications.length === 0" class="empty-state-modern">
          <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">No applications yet</h3>
          <p class="text-gray-600 mb-8 text-lg">You haven't applied for any jobs yet. Start exploring opportunities!</p>
          <button (click)="goBack()" class="modern-btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
            </svg>
            Browse Jobs
          </button>
        </div>

        <!-- Applications List -->
        <div class="grid gap-8" *ngIf="!loading && applications.length > 0">
          <div *ngFor="let application of applications" class="application-card">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-2xl font-bold text-gray-900">{{application.jobTitle}}</h3>
                  <span [class]="getStatusClass(application.status)">
                    {{getStatusDisplay(application.status)}}
                  </span>
                </div>
                <p class="text-lg font-semibold text-gray-700 mb-4">{{application.company}}</p>
                <div class="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2"></path>
                    </svg>
                    Applied on {{formatDate(application.submittedAt)}}
                  </div>
                  <div class="flex items-center" *ngIf="application.resumeFileName">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Resume: {{application.resumeFileName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  currentUser = this.authService.getCurrentUser();

  constructor(
      private applicationService: ApplicationService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.loading = false;
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
        return 'Interview Scheduled';
      case ApplicationStatus.Rejected:
        return 'Not Selected';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}