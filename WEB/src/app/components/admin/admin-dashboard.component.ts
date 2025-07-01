import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../services/job.service';
import { JobPosting, Application } from '../../models/job.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage job postings and applications</p>
      </div>

      <div class="grid grid-cols-1 mb-6" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
        <div class="card">
          <div class="card-body text-center">
            <h3 class="font-bold" style="margin: 0 0 0.5rem 0; color: #2563eb; font-size: 2rem;">{{totalJobs}}</h3>
            <p style="margin: 0; color: #64748b;">Total Jobs</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body text-center">
            <h3 class="font-bold" style="margin: 0 0 0.5rem 0; color: #16a34a; font-size: 2rem;">{{activeJobs}}</h3>
            <p style="margin: 0; color: #64748b;">Active Jobs</p>
          </div>
        </div>
        <div class="card">
          <div class="card-body text-center">
            <h3 class="font-bold" style="margin: 0 0 0.5rem 0; color: #dc2626; font-size: 2rem;">{{totalApplications}}</h3>
            <p style="margin: 0; color: #64748b;">Total Applications</p>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mb-6">
        <h2 class="font-bold" style="margin: 0;">Quick Actions</h2>
        <a routerLink="/admin/jobs/new" class="btn btn-primary">Create New Job</a>
      </div>

      <div class="grid grid-cols-1 gap-4" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <div class="card">
          <div class="card-header">
            <h3 style="margin: 0;">Job Management</h3>
          </div>
          <div class="card-body">
            <p class="mb-4">Create, edit, and manage job postings</p>
            <div class="flex flex-col gap-2">
              <a routerLink="/admin/jobs" class="btn btn-secondary">View All Jobs</a>
              <a routerLink="/admin/jobs/new" class="btn btn-primary">Create New Job</a>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 style="margin: 0;">Application Management</h3>
          </div>
          <div class="card-body">
            <p class="mb-4">Review and process job applications</p>
            <div class="flex flex-col gap-2">
              <a routerLink="/admin/applications" class="btn btn-secondary">View All Applications</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  totalJobs = 0;
  activeJobs = 0;
  totalApplications = 0;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.jobService.getJobPostings().subscribe({
      next: (jobs) => {
        this.totalJobs = jobs.length;
        this.activeJobs = jobs.filter(j => j.status === 'Active').length;
      }
    });

    this.jobService.getAllApplications().subscribe({
      next: (applications) => {
        this.totalApplications = applications.length;
      }
    });
  }
}