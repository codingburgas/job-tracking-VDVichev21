import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="application-list-container">
      <h1 class="mb-6">My Applications</h1>

      <div *ngIf="loading" class="text-center">
        <div class="spinner"></div>
        <p>Loading applications...</p>
      </div>

      <div *ngIf="!loading && applications.length === 0" class="text-center">
        <div class="card">
          <div class="card-body">
            <p class="text-gray-600 mb-4">You haven't submitted any applications yet.</p>
            <a routerLink="/jobs" class="btn btn-primary">Browse Jobs</a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && applications.length > 0" class="space-y-4">
        <div *ngFor="let application of applications" class="card application-card">
          <div class="card-body">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="job-title">{{ application.jobTitle }}</h3>
                <p class="company-name">{{ application.companyName }}</p>
              </div>
              <span class="badge" [ngClass]="getStatusClass(application.status)">
                {{ getStatusDisplay(application.status) }}
              </span>
            </div>
            
            <div class="application-meta">
              <div class="meta-row">
                <strong>Applied:</strong> {{ application.submittedAt | date:'medium' }}
              </div>
              <div *ngIf="application.updatedAt" class="meta-row">
                <strong>Last Updated:</strong> {{ application.updatedAt | date:'medium' }}
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <a [routerLink]="['/jobs', application.jobPostingId]" class="btn btn-outline btn-sm">
              View Job Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .application-list-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .application-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .application-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .job-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .company-name {
      font-weight: 500;
      color: #2563eb;
    }
    
    .application-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .meta-row {
      display: flex;
      gap: 0.5rem;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .text-gray-600 { color: #4b5563; }
  `]
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(private applicationService: ApplicationService) {}

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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Submitted':
        return 'badge-primary';
      case 'ApprovedForInterview':
        return 'badge-success';
      case 'Rejected':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  }

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'ApprovedForInterview':
        return 'Approved for Interview';
      default:
        return status;
    }
  }
}