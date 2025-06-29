// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ApplicationService } from '../../services/application.service';
// import { Application } from '../../models/application.model';
//
// @Component({
//   selector: 'app-admin-application-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   template: `
//     <div class="admin-application-list-container">
//       <!-- Header Section -->
//       <div class="header-section">
//         <div class="header-content">
//           <div class="header-text">
//             <h1 class="main-title">Manage Applications</h1>
//             <p class="subtitle">Review and update application statuses</p>
//           </div>
//           <div class="header-actions">
//             <a routerLink="/admin/jobs" class="btn btn-outline">
//               <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
//               </svg>
//               Manage Jobs
//             </a>
//           </div>
//         </div>
//       </div>
//
//       <!-- Stats Section -->
//       <div class="stats-section">
//         <div class="stats-grid">
//           <div class="stat-card">
//             <div class="stat-icon stat-icon-total">
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//               </svg>
//             </div>
//             <div class="stat-content">
//               <div class="stat-number">{{ applications.length }}</div>
//               <div class="stat-label">Total Applications</div>
//             </div>
//           </div>
//
//           <div class="stat-card">
//             <div class="stat-icon stat-icon-submitted">
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <div class="stat-content">
//               <div class="stat-number">{{ getStatusCount('Submitted') }}</div>
//               <div class="stat-label">Pending Review</div>
//             </div>
//           </div>
//
//           <div class="stat-card">
//             <div class="stat-icon stat-icon-approved">
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <div class="stat-content">
//               <div class="stat-number">{{ getStatusCount('ApprovedForInterview') }}</div>
//               <div class="stat-label">Approved</div>
//             </div>
//           </div>
//
//           <div class="stat-card">
//             <div class="stat-icon stat-icon-rejected">
//               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <div class="stat-content">
//               <div class="stat-number">{{ getStatusCount('Rejected') }}</div>
//               <div class="stat-label">Rejected</div>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       <!-- Loading State -->
//       <div *ngIf="loading" class="loading-container">
//         <div class="loading-spinner">
//           <div class="spinner"></div>
//           <p class="loading-text">Loading applications...</p>
//         </div>
//       </div>
//
//       <!-- Empty State -->
//       <div *ngIf="!loading && applications.length === 0" class="empty-container">
//         <div class="empty-card">
//           <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
//           </svg>
//           <h3>No Applications Found</h3>
//           <p>There are no job applications to review at the moment.</p>
//         </div>
//       </div>
//
//       <!-- Applications Table -->
//       <div *ngIf="!loading && applications.length > 0" class="applications-table-section">
//         <div class="table-card">
//           <div class="table-header">
//             <h3>All Applications</h3>
//           </div>
//           <div class="table-container">
//             <table class="applications-table">
//               <thead>
//               <tr>
//                 <th>Applicant</th>
//                 <th>Job Details</th>
//                 <th>Applied Date</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//               </thead>
//               <tbody>
//               <tr *ngFor="let application of applications; trackBy: trackByApplicationId" class="application-row">
//                 <td class="applicant-cell">
//                   <div class="applicant-info">
//                     <div class="applicant-avatar">
//                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                       </svg>
//                     </div>
//                     <div class="applicant-details">
//                       <div class="applicant-name">{{ application.userName }}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td class="job-cell">
//                   <div class="job-info">
//                     <a [routerLink]="['/jobs', application.jobPostingId]" class="job-title-link">
//                       {{ application.jobTitle }}
//                     </a>
//                     <div class="company-name">{{ application.companyName }}</div>
//                   </div>
//                 </td>
//                 <td class="date-cell">
//                   <div class="date-info">
//                     <div class="date-primary">{{ application.submittedAt | date:'MMM d, y' }}</div>
//                     <div class="date-secondary">{{ application.submittedAt | date:'shortTime' }}</div>
//                   </div>
//                 </td>
//                 <td class="status-cell">
//                     <span class="status-badge" [ngClass]="getStatusClass(application.status)">
//                       {{ getStatusDisplay(application.status) }}
//                     </span>
//                 </td>
//                 <td class="actions-cell">
//                   <div class="action-controls">
//                     <select
//                         class="status-select"
//                         [value]="application.status"
//                         (change)="updateStatus(application, $event)">
//                       <option value="Submitted">Submitted</option>
//                       <option value="ApprovedForInterview">Approved for Interview</option>
//                       <option value="Rejected">Rejected</option>
//                     </select>
//                   </div>
//                 </td>
//               </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//
//       <!-- Success/Error Messages -->
//       <div *ngIf="successMessage" class="message-container">
//         <div class="success-message">
//           <svg class="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//           </svg>
//           {{ successMessage }}
//         </div>
//       </div>
//
//       <div *ngIf="errorMessage" class="message-container">
//         <div class="error-message">
//           <svg class="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//           </svg>
//           {{ errorMessage }}
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .admin-application-list-container {
//       max-width: 1400px;
//       margin: 0 auto;
//       padding: 0 1rem;
//     }
//
//     /* Header Section */
//     .header-section {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       border-radius: 1rem;
//       padding: 3rem 2rem;
//       margin-bottom: 2rem;
//       color: white;
//     }
//
//     .header-content {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       gap: 2rem;
//     }
//
//     .main-title {
//       font-size: 2.5rem;
//       font-weight: 700;
//       margin-bottom: 0.5rem;
//       line-height: 1.2;
//     }
//
//     .subtitle {
//       font-size: 1.125rem;
//       opacity: 0.9;
//       margin: 0;
//     }
//
//     .header-actions {
//       display: flex;
//       gap: 1rem;
//       flex-shrink: 0;
//     }
//
//     /* Stats Section */
//     .stats-section {
//       margin-bottom: 2rem;
//     }
//
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//       gap: 1.5rem;
//     }
//
//     .stat-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       transition: transform 0.2s ease;
//     }
//
//     .stat-card:hover {
//       transform: translateY(-2px);
//     }
//
//     .stat-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 0.75rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       flex-shrink: 0;
//     }
//
//     .stat-icon svg {
//       width: 1.5rem;
//       height: 1.5rem;
//     }
//
//     .stat-icon-total {
//       background-color: #dbeafe;
//       color: #1e40af;
//     }
//
//     .stat-icon-submitted {
//       background-color: #fef3c7;
//       color: #92400e;
//     }
//
//     .stat-icon-approved {
//       background-color: #d1fae5;
//       color: #065f46;
//     }
//
//     .stat-icon-rejected {
//       background-color: #fee2e2;
//       color: #991b1b;
//     }
//
//     .stat-number {
//       font-size: 2rem;
//       font-weight: 700;
//       color: #1f2937;
//       line-height: 1;
//     }
//
//     .stat-label {
//       font-size: 0.875rem;
//       color: #6b7280;
//       font-weight: 500;
//     }
//
//     /* Loading and Empty States */
//     .loading-container,
//     .empty-container {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       min-height: 300px;
//     }
//
//     .loading-spinner,
//     .empty-card {
//       text-align: center;
//       padding: 2rem;
//     }
//
//     .empty-card {
//       background: white;
//       border-radius: 1rem;
//       box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//       max-width: 400px;
//     }
//
//     .loading-text {
//       margin-top: 1rem;
//       color: #6b7280;
//       font-size: 1.125rem;
//     }
//
//     .empty-icon {
//       width: 4rem;
//       height: 4rem;
//       color: #6b7280;
//       margin: 0 auto 1rem;
//     }
//
//     .empty-card h3 {
//       font-size: 1.5rem;
//       font-weight: 600;
//       margin-bottom: 0.5rem;
//       color: #1f2937;
//     }
//
//     .empty-card p {
//       color: #6b7280;
//       margin-bottom: 1.5rem;
//     }
//
//     /* Applications Table */
//     .applications-table-section {
//       margin-bottom: 2rem;
//     }
//
//     .table-card {
//       background: white;
//       border-radius: 1rem;
//       box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
//       overflow: hidden;
//     }
//
//     .table-header {
//       padding: 1.5rem 2rem;
//       border-bottom: 1px solid #e5e7eb;
//       background-color: #f9fafb;
//     }
//
//     .table-header h3 {
//       font-size: 1.25rem;
//       font-weight: 600;
//       color: #1f2937;
//       margin: 0;
//     }
//
//     .table-container {
//       overflow-x: auto;
//     }
//
//     .applications-table {
//       width: 100%;
//       border-collapse: collapse;
//     }
//
//     .applications-table th {
//       padding: 1rem 1.5rem;
//       text-align: left;
//       font-weight: 600;
//       color: #374151;
//       background-color: #f9fafb;
//       border-bottom: 1px solid #e5e7eb;
//       font-size: 0.875rem;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
//
//     .applications-table td {
//       padding: 1.5rem;
//       border-bottom: 1px solid #e5e7eb;
//       vertical-align: top;
//     }
//
//     .application-row:hover {
//       background-color: #f9fafb;
//     }
//
//     .applicant-info {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//     }
//
//     .applicant-avatar {
//       width: 2.5rem;
//       height: 2.5rem;
//       background-color: #f3f4f6;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: #6b7280;
//       flex-shrink: 0;
//     }
//
//     .applicant-avatar svg {
//       width: 1.25rem;
//       height: 1.25rem;
//     }
//
//     .applicant-name {
//       font-weight: 600;
//       color: #1f2937;
//     }
//
//     .job-title-link {
//       color: #667eea;
//       text-decoration: none;
//       font-weight: 600;
//       font-size: 0.875rem;
//     }
//
//     .job-title-link:hover {
//       text-decoration: underline;
//     }
//
//     .company-name {
//       font-size: 0.75rem;
//       color: #6b7280;
//       margin-top: 0.25rem;
//     }
//
//     .date-info {
//       display: flex;
//       flex-direction: column;
//     }
//
//     .date-primary {
//       font-weight: 500;
//       color: #1f2937;
//       font-size: 0.875rem;
//     }
//
//     .date-secondary {
//       font-size: 0.75rem;
//       color: #6b7280;
//     }
//
//     .status-badge {
//       padding: 0.25rem 0.75rem;
//       border-radius: 9999px;
//       font-size: 0.75rem;
//       font-weight: 600;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
//
//     .status-submitted {
//       background-color: #fef3c7;
//       color: #92400e;
//     }
//
//     .status-approved {
//       background-color: #d1fae5;
//       color: #065f46;
//     }
//
//     .status-rejected {
//       background-color: #fee2e2;
//       color: #991b1b;
//     }
//
//     .status-select {
//       padding: 0.5rem 0.75rem;
//       border: 1px solid #d1d5db;
//       border-radius: 0.5rem;
//       font-size: 0.875rem;
//       background-color: white;
//       min-width: 150px;
//       transition: border-color 0.2s ease;
//     }
//
//     .status-select:focus {
//       outline: none;
//       border-color: #667eea;
//       box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//     }
//
//     /* Messages */
//     .message-container {
//       margin-bottom: 1rem;
//     }
//
//     .success-message,
//     .error-message {
//       display: flex;
//       align-items: center;
//       padding: 1rem 1.5rem;
//       border-radius: 0.75rem;
//       font-weight: 500;
//     }
//
//     .success-message {
//       background-color: #d1fae5;
//       color: #065f46;
//       border: 1px solid #a7f3d0;
//     }
//
//     .error-message {
//       background-color: #fee2e2;
//       color: #991b1b;
//       border: 1px solid #fecaca;
//     }
//
//     .message-icon {
//       width: 1.25rem;
//       height: 1.25rem;
//       margin-right: 0.75rem;
//       flex-shrink: 0;
//     }
//
//     /* Utility Classes */
//     .w-5 { width: 1.25rem; }
//     .h-5 { height: 1.25rem; }
//     .mr-2 { margin-right: 0.5rem; }
//
//     /* Responsive Design */
//     @media (max-width: 768px) {
//       .header-content {
//         flex-direction: column;
//         text-align: center;
//       }
//
//       .main-title {
//         font-size: 2rem;
//       }
//
//       .stats-grid {
//         grid-template-columns: repeat(2, 1fr);
//       }
//
//       .header-actions {
//         width: 100%;
//         justify-content: center;
//       }
//
//       .table-container {
//         font-size: 0.875rem;
//       }
//
//       .applications-table th,
//       .applications-table td {
//         padding: 0.75rem;
//       }
//     }
//
//     @media (max-width: 480px) {
//       .header-section {
//         padding: 2rem 1rem;
//       }
//
//       .stats-grid {
//         grid-template-columns: 1fr;
//       }
//
//       .stat-card {
//         padding: 1rem;
//       }
//
//       .stat-icon {
//         width: 2.5rem;
//         height: 2.5rem;
//       }
//
//       .stat-number {
//         font-size: 1.5rem;
//       }
//     }
//   `]
// })
// export class AdminApplicationListComponent implements OnInit {
//   applications: Application[] = [];
//   loading = true;
//   successMessage = '';
//   errorMessage = '';
//
//   constructor(private applicationService: ApplicationService) {}
//
//   ngOnInit(): void {
//     this.loadApplications();
//   }
//
//   loadApplications(): void {
//     this.applicationService.getApplications().subscribe({
//       next: (applications) => {
//         this.applications = applications;
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading applications:', error);
//         this.loading = false;
//       }
//     });
//   }
//
//   updateStatus(application: Application, event: any): void {
//     const newStatus = event.target.value;
//
//     this.applicationService.updateApplicationStatus(application.id, { status: newStatus }).subscribe({
//       next: (updatedApplication) => {
//         // Update the local application
//         const index = this.applications.findIndex(app => app.id === application.id);
//         if (index !== -1) {
//           this.applications[index] = updatedApplication;
//         }
//
//         this.successMessage = 'Application status updated successfully!';
//         setTimeout(() => this.successMessage = '', 3000);
//       },
//       error: (error) => {
//         this.errorMessage = 'Failed to update application status. Please try again.';
//         setTimeout(() => this.errorMessage = '', 3000);
//
//         // Reset the select to original value
//         event.target.value = application.status;
//       }
//     });
//   }
//
//   getStatusClass(status: string): string {
//     switch (status) {
//       case 'Submitted':
//         return 'status-submitted';
//       case 'ApprovedForInterview':
//         return 'status-approved';
//       case 'Rejected':
//         return 'status-rejected';
//       default:
//         return 'status-submitted';
//     }
//   }
//
//   getStatusDisplay(status: string): string {
//     switch (status) {
//       case 'ApprovedForInterview':
//         return 'Approved for Interview';
//       default:
//         return status;
//     }
//   }
//
//   getStatusCount(status: string): number {
//     return this.applications.filter(app => app.status === status).length;
//   }
//
//   trackByApplicationId(index: number, application: Application): number {
//     return application.id;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-admin-application-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="bg-primary text-white p-4 rounded">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h1 class="h2 mb-1">Manage Applications</h1>
                <p class="mb-0">Review and update application statuses</p>
              </div>
              <div class="col-md-4 text-md-end">
                <a routerLink="/admin/jobs" class="btn btn-light">Manage Jobs</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-primary">{{ applications.length }}</h3>
              <p class="mb-0">Total Applications</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-warning">{{ getStatusCount('Submitted') }}</h3>
              <p class="mb-0">Pending Review</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-success">{{ getStatusCount('ApprovedForInterview') }}</h3>
              <p class="mb-0">Approved</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-danger">{{ getStatusCount('Rejected') }}</h3>
              <p class="mb-0">Rejected</p>
            </div>
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
            <h3>No Applications Found</h3>
            <p class="text-muted">There are no job applications to review at the moment.</p>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && applications.length > 0" class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">All Applications</h4>
            </div>
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Job Details</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let application of applications; trackBy: trackByApplicationId">
                    <td>
                      <h6 class="mb-0">{{ application.userName }}</h6>
                    </td>
                    <td>
                      <a [routerLink]="['/jobs', application.jobPostingId]" class="text-decoration-none">
                        <h6 class="mb-1">{{ application.jobTitle }}</h6>
                      </a>
                      <small class="text-muted">{{ application.companyName }}</small>
                    </td>
                    <td>
                      <div>{{ application.submittedAt | date:'MMM d, y' }}</div>
                      <small class="text-muted">{{ application.submittedAt | date:'shortTime' }}</small>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(application.status)">
                        {{ getStatusDisplay(application.status) }}
                      </span>
                    </td>
                    <td>
                      <select 
                        class="form-select form-select-sm"
                        [value]="application.status"
                        (change)="updateStatus(application, $event)">
                        <option value="Submitted">Submitted</option>
                        <option value="ApprovedForInterview">Approved for Interview</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #e0e0e0;
    }
    .table th {
      background-color: #f8f9fa;
    }
  `]
})
export class AdminApplicationListComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

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

  updateStatus(application: Application, event: any): void {
    const newStatus = event.target.value;

    this.applicationService.updateApplicationStatus(application.id, { status: newStatus }).subscribe({
      next: (updatedApplication) => {
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index !== -1) {
          this.applications[index] = updatedApplication;
        }

        this.successMessage = 'Application status updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update application status. Please try again.';
        setTimeout(() => this.errorMessage = '', 3000);

        event.target.value = application.status;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Submitted':
        return 'bg-warning';
      case 'ApprovedForInterview':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-warning';
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

  getStatusCount(status: string): number {
    return this.applications.filter(app => app.status === status).length;
  }

  trackByApplicationId(index: number, application: Application): number {
    return application.id;
  }
}