import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Application } from '../../models/job.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
      </div>

      <div class="empty-state" *ngIf="!isLoading && applications.length === 0">
        <h3>No applications yet</h3>
        <p>You haven't applied to any jobs yet. Browse available jobs to get started!</p>
      </div>

      <div class="grid grid-cols-1" *ngIf="!isLoading && applications.length > 0">
        <div class="card" *ngFor="let application of applications">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold" style="margin: 0 0 0.5rem 0; color: #1e293b;">{{application.jobTitle}}</h3>
                <p class="font-semibold text-gray-600" style="margin: 0;">{{application.companyName}}</p>
              </div>
              <span class="badge" [ngClass]="{
                'badge-primary': application.status === 'Submitted',
                'badge-warning': application.status === 'SelectedForInterview',
                'badge-danger': application.status === 'Rejected'
              }">
                {{getStatusText(application.status)}}
              </span>
            </div>
            
            <div class="text-sm text-gray-500">
              Applied: {{formatDate(application.dateApplied)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  isLoading = true;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.jobService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Submitted': return 'Submitted';
      case 'SelectedForInterview': return 'Selected for Interview';
      case 'Rejected': return 'Rejected';
      default: return status;
    }
  }
}