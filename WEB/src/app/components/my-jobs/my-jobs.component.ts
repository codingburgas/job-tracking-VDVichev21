import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobPosting } from '../../models/job.model';

@Component({
    selector: 'app-my-jobs',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="font-bold" style="margin: 0 0 0.5rem 0;">My Job Postings</h1>
          <p style="margin: 0; color: #64748b;">Manage your job postings and view applications</p>
        </div>
        <a routerLink="/my-jobs/new" class="btn btn-primary">Post New Job</a>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
      </div>

      <div class="empty-state" *ngIf="!isLoading && jobs.length === 0">
        <h3>No jobs posted yet</h3>
        <p>Create your first job posting to get started.</p>
        <a routerLink="/my-jobs/new" class="btn btn-primary">Post Your First Job</a>
      </div>

      <div class="grid grid-cols-1" *ngIf="!isLoading && jobs.length > 0">
        <div class="card" *ngFor="let job of jobs">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold" style="margin: 0 0 0.5rem 0; color: #1e293b;">{{job.title}}</h3>
                <p class="font-semibold text-gray-600" style="margin: 0;">{{job.companyName}}</p>
              </div>
              <span class="badge" [ngClass]="{
                'badge-success': job.status === 'Active',
                'badge-secondary': job.status === 'Inactive'
              }">
                {{job.status}}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4" style="line-height: 1.6;">{{truncateText(job.description, 200)}}</p>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Posted: {{formatDate(job.datePosted)}}
              </span>
              
              <div class="flex gap-2">
                <button (click)="viewApplications(job.id)" class="btn btn-secondary">
                  View Applications
                </button>
                <a [routerLink]="['/my-jobs', job.id, 'edit']" class="btn btn-secondary">Edit</a>
                <button 
                  (click)="toggleStatus(job)" 
                  class="btn"
                  [ngClass]="job.status === 'Active' ? 'btn-secondary' : 'btn-primary'">
                  {{job.status === 'Active' ? 'Deactivate' : 'Activate'}}
                </button>
                <button (click)="deleteJob(job.id)" class="btn btn-danger">Delete</button>
              </div>
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
    </div>
  `
})
export class MyJobsComponent implements OnInit {
    jobs: JobPosting[] = [];
    isLoading = true;
    successMessage = '';
    errorMessage = '';

    constructor(private jobService: JobService) {}

    ngOnInit(): void {
        this.loadJobs();
    }

    loadJobs(): void {
        this.jobService.getMyJobPostings().subscribe({
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

    viewApplications(jobId: number): void {
        // Navigate to applications for this specific job
        // For now, we'll just show a message
        this.successMessage = 'Feature coming soon: View applications for specific job';
        setTimeout(() => this.successMessage = '', 3000);
    }

    toggleStatus(job: JobPosting): void {
        const newStatus = job.status === 'Active' ? 'Inactive' : 'Active';

        this.jobService.updateJobStatus(job.id, newStatus).subscribe({
            next: () => {
                job.status = newStatus;
                this.successMessage = `Job ${newStatus.toLowerCase()} successfully`;
                setTimeout(() => this.successMessage = '', 3000);
            },
            error: (error) => {
                this.errorMessage = 'Failed to update job status';
                setTimeout(() => this.errorMessage = '', 3000);
            }
        });
    }

    deleteJob(jobId: number): void {
        if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            this.jobService.deleteJobPosting(jobId).subscribe({
                next: () => {
                    this.jobs = this.jobs.filter(j => j.id !== jobId);
                    this.successMessage = 'Job deleted successfully';
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (error) => {
                    this.errorMessage = 'Failed to delete job';
                    setTimeout(() => this.errorMessage = '', 3000);
                }
            });
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }

    truncateText(text: string, length: number): string {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
}