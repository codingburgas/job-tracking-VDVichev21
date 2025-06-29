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
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="bg-primary text-white p-4 rounded">
            <h1 class="h2 mb-1">My Applications</h1>
            <p class="mb-0">Track your job applications and their status</p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="row">
        <div class="col-12">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-3 text-muted">Loading applications...</p>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && applications.length === 0" class="row">
        <div class="col-12">
          <div class="text-center py-5">
            <h3>No Applications Yet</h3>
            <p class="text-muted">You haven't submitted any applications yet.</p>
            <a routerLink="/jobs" class="btn btn-primary">Browse Jobs</a>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && applications.length > 0" class="row">
        <div class="col-lg-4 col-md-6 mb-3" *ngFor="let application of applications; trackBy: trackByApplicationId">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1">{{ application.jobTitle }}</h5>
                  <h6 class="card-subtitle text-primary mb-2">{{ application.companyName }}</h6>
                </div>
                <span class="badge" [ngClass]="getStatusClass(application.status)">
                  {{ getStatusDisplay(application.status) }}
                </span>
              </div>

              <div class="row text-center small text-muted mb-3">
                <div class="col-6">
                  <strong>Applied</strong><br>
                  {{ application.submittedAt | date:'MMM d, y' }}
                </div>
                <div class="col-6" *ngIf="application.updatedAt">
                  <strong>Updated</strong><br>
                  {{ application.updatedAt | date:'MMM d, y' }}
                </div>
              </div>

              <a [routerLink]="['/jobs', application.jobPostingId]" class="btn btn-primary w-100">
                View Job Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #e0e0e0;
    }
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
        return 'bg-primary';
      case 'ApprovedForInterview':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'ApprovedForInterview':
        return 'Approved';
      default:
        return status;
    }
  }

  trackByApplicationId(index: number, application: Application): number {
    return application.id;
  }
}