import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Simple Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="bg-primary text-white p-4 rounded">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h1 class="h2 mb-1">Find Your Dream Job</h1>
                <p class="mb-0">Discover opportunities from top companies</p>
              </div>
              <div class="col-md-4 text-md-end" *ngIf="isAdmin()">
                <a routerLink="/admin/jobs/new" class="btn btn-light me-2">Post Job</a>
                <a routerLink="/admin/jobs" class="btn btn-outline-light">Manage</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple Search -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <input
                      type="text"
                      class="form-control"
                      placeholder="Search jobs..."
                      [(ngModel)]="searchTerm"
                      (input)="filterJobs()">
                </div>
                <div class="col-md-3">
                  <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterJobs()">
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <button (click)="clearFilters()" class="btn btn-outline-secondary w-100">
                    Clear
                  </button>
                </div>
              </div>
              <div class="mt-2">
                <small class="text-muted">{{ filteredJobs.length }} jobs found</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="row">
        <div class="col-12">
          <div class="text-center py-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-3 text-muted">Loading jobs...</p>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="errorMessage" class="row">
        <div class="col-12">
          <div class="alert alert-danger text-center">
            <strong>Error:</strong> {{ errorMessage }}
            <br>
            <button (click)="loadJobs()" class="btn btn-primary mt-2">Try Again</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !errorMessage && filteredJobs.length === 0 && jobs.length === 0" class="row">
        <div class="col-12">
          <div class="text-center py-5">
            <h3>No Jobs Available</h3>
            <p class="text-muted">Check back later for new opportunities!</p>
            <div *ngIf="isAdmin()">
              <a routerLink="/admin/jobs/new" class="btn btn-primary">Post First Job</a>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="!loading && !errorMessage && filteredJobs.length === 0 && jobs.length > 0" class="row">
        <div class="col-12">
          <div class="text-center py-5">
            <h3>No Results Found</h3>
            <p class="text-muted">Try different search terms.</p>
            <button (click)="clearFilters()" class="btn btn-primary">Clear Filters</button>
          </div>
        </div>
      </div>

      <!-- Simple Job Cards -->
      <div *ngIf="!loading && !errorMessage && filteredJobs.length > 0" class="row">
        <div class="col-lg-4 col-md-6 mb-3" *ngFor="let job of filteredJobs; trackBy: trackByJobId">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1">{{ job.title }}</h5>
                  <h6 class="card-subtitle text-primary mb-2">{{ job.companyName }}</h6>
                </div>
                <span class="badge" [ngClass]="getStatusClass(job.status)">
                  {{ job.status }}
                </span>
              </div>

              <p class="card-text text-muted small">{{ getJobDescription(job.description) }}</p>

              <div class="row text-center small text-muted mb-3">
                <div class="col-6">
                  <strong>{{ job.applicationsCount }}</strong><br>
                  Applications
                </div>
                <div class="col-6">
                  <strong>{{ job.publishedDate | date:'MMM d' }}</strong><br>
                  Published
                </div>
              </div>

              <a [routerLink]="['/jobs', job.id]" class="btn btn-primary w-100">
                View Details
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
    .card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: JobPosting[] = [];
  filteredJobs: JobPosting[] = [];
  loading = true;
  errorMessage = '';
  searchTerm = '';
  selectedStatus = '';

  constructor(
      private jobService: JobService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = [...jobs];
        this.loading = false;
        this.filterJobs();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load jobs.';
        this.loading = false;
      }
    });
  }

  filterJobs(): void {
    let filtered = [...this.jobs];

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(searchLower) ||
          job.companyName.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(job => job.status === this.selectedStatus);
    }

    this.filteredJobs = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filteredJobs = [...this.jobs];
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-danger';
  }

  getJobDescription(description: string): string {
    return description.length > 120 ? description.substring(0, 120) + '...' : description;
  }

  trackByJobId(index: number, job: JobPosting): number {
    return job.id;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}