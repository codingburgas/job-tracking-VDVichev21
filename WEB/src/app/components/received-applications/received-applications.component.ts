import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Application } from '../../models/job.model';

@Component({
    selector: 'app-received-applications',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <div class="page-header">
        <h1>Received Applications</h1>
        <p>Review applications for your job postings</p>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
      </div>

      <div class="empty-state" *ngIf="!isLoading && applications.length === 0">
        <h3>No applications received</h3>
        <p>Applications will appear here when people apply to your job postings.</p>
      </div>

      <div class="grid grid-cols-1" *ngIf="!isLoading && applications.length > 0">
        <div class="card" *ngFor="let application of applications">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold" style="margin: 0 0 0.5rem 0; color: #1e293b;">{{application.jobTitle}}</h3>
                <p class="font-semibold text-gray-600" style="margin: 0 0 0.5rem 0;">{{application.companyName}}</p>
                <p class="text-sm text-gray-500" style="margin: 0;">Applicant: {{application.userName}}</p>
              </div>
              <span class="badge" [ngClass]="{
                'badge-primary': application.status === 'Submitted',
                'badge-warning': application.status === 'SelectedForInterview',
                'badge-danger': application.status === 'Rejected'
              }">
                {{getStatusText(application.status)}}
              </span>
            </div>
            
            <div class="flex justify-between items-center mb-4" *ngIf="application.resumeFileName">
              <div class="resume-info">
                <span class="text-sm text-gray-600">Resume: </span>
                <button 
                  (click)="downloadResume(application.id, application.resumeFileName!)"
                  class="resume-link">
                  📄 {{application.resumeFileName}}
                </button>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">
                Applied: {{formatDate(application.dateApplied)}}
              </span>
              
              <div class="flex gap-2">
                <button 
                  *ngIf="application.status === 'Submitted'"
                  (click)="updateStatus(application.id, 'SelectedForInterview')" 
                  class="btn btn-primary"
                  style="font-size: 0.75rem; padding: 0.5rem 1rem;">
                  Select for Interview
                </button>
                <button 
                  *ngIf="application.status !== 'Rejected'"
                  (click)="updateStatus(application.id, 'Rejected')" 
                  class="btn btn-danger"
                  style="font-size: 0.75rem; padding: 0.5rem 1rem;">
                  Reject
                </button>
                <button 
                  *ngIf="application.status !== 'Submitted'"
                  (click)="updateStatus(application.id, 'Submitted')" 
                  class="btn btn-secondary"
                  style="font-size: 0.75rem; padding: 0.5rem 1rem;">
                  Reset to Submitted
                </button>
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
  `,
    styles: [`
    .resume-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .resume-link {
      background: none;
      border: none;
      color: #2563eb;
      cursor: pointer;
      text-decoration: underline;
      font-size: 0.875rem;
      padding: 0;
    }

    .resume-link:hover {
      color: #1d4ed8;
    }
  `]
})
export class ReceivedApplicationsComponent implements OnInit {
    applications: Application[] = [];
    isLoading = true;
    successMessage = '';
    errorMessage = '';

    constructor(private jobService: JobService) {}

    ngOnInit(): void {
        this.loadApplications();
    }

    loadApplications(): void {
        this.jobService.getReceivedApplications().subscribe({
            next: (applications) => {
                this.applications = applications;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load applications';
                this.isLoading = false;
            }
        });
    }

    updateStatus(applicationId: number, status: 'Submitted' | 'SelectedForInterview' | 'Rejected'): void {
        this.jobService.updateApplicationStatus(applicationId, status).subscribe({
            next: () => {
                const application = this.applications.find(a => a.id === applicationId);
                if (application) {
                    application.status = status;
                }
                this.successMessage = 'Application status updated successfully';
                setTimeout(() => this.successMessage = '', 3000);
            },
            error: (error) => {
                this.errorMessage = 'Failed to update application status';
                setTimeout(() => this.errorMessage = '', 3000);
            }
        });
    }

    downloadResume(applicationId: number, fileName: string): void {
        this.jobService.downloadResume(applicationId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.errorMessage = 'Failed to download resume';
                setTimeout(() => this.errorMessage = '', 3000);
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