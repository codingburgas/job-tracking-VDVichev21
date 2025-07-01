import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { JobPosting } from '../../models/job.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>{{isEditing ? 'Edit Job' : 'Create New Job'}}</h1>
        <p>{{isEditing ? 'Update job posting details' : 'Add a new job posting to the system'}}</p>
      </div>

      <div class="flex justify-center">
        <div class="card" style="width: 100%; max-width: 600px;">
          <div class="card-body">
            <div class="alert alert-danger" *ngIf="errorMessage">
              {{errorMessage}}
            </div>

            <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Job Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  formControlName="title"
                  [class.is-invalid]="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">
                <div class="invalid-feedback" *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">
                  Job title is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Company Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  formControlName="companyName"
                  [class.is-invalid]="jobForm.get('companyName')?.invalid && jobForm.get('companyName')?.touched">
                <div class="invalid-feedback" *ngIf="jobForm.get('companyName')?.invalid && jobForm.get('companyName')?.touched">
                  Company name is required
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Job Description</label>
                <textarea 
                  class="form-control" 
                  formControlName="description" 
                  rows="6"
                  [class.is-invalid]="jobForm.get('description')?.invalid && jobForm.get('description')?.touched">
                </textarea>
                <div class="invalid-feedback" *ngIf="jobForm.get('description')?.invalid && jobForm.get('description')?.touched">
                  Job description is required
                </div>
              </div>

              <div class="flex gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="jobForm.invalid || isLoading">
                  {{isLoading ? 'Saving...' : (isEditing ? 'Update Job' : 'Create Job')}}
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary" 
                  (click)="goBack()">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEditing = false;
  jobId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      companyName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditing = true;
      this.jobId = parseInt(id);
      this.loadJob();
    }
  }

  loadJob(): void {
    if (this.jobId) {
      this.jobService.getJobPosting(this.jobId).subscribe({
        next: (job) => {
          this.jobForm.patchValue({
            title: job.title,
            companyName: job.companyName,
            description: job.description
          });
        },
        error: (error) => {
          this.errorMessage = 'Failed to load job details';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.jobForm.value;

      if (this.isEditing && this.jobId) {
        this.jobService.updateJobPosting(this.jobId, formData).subscribe({
          next: () => {
            this.router.navigate(['/admin/jobs']);
          },
          error: (error) => {
            this.errorMessage = error.error || 'Failed to update job';
            this.isLoading = false;
          }
        });
      } else {
        this.jobService.createJobPosting(formData).subscribe({
          next: () => {
            this.router.navigate(['/admin/jobs']);
          },
          error: (error) => {
            this.errorMessage = error.error || 'Failed to create job';
            this.isLoading = false;
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/jobs']);
  }
}