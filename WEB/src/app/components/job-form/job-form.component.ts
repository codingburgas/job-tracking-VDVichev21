import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { JobPosting } from '../../models/job.model';

@Component({
    selector: 'app-job-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="container">
            <div class="page-header">
                <h1>{{isEditing ? 'Edit Job Posting' : 'Post a New Job'}}</h1>
                <p>{{isEditing ? 'Update your job posting details' : 'Share your job opportunity with the community'}}</p>
            </div>

            <div class="flex justify-center">
                <div class="card" style="width: 100%; max-width: 600px;">
                    <div class="card-body">
                        <div class="alert alert-success" *ngIf="successMessage">
                            {{successMessage}}
                        </div>

                        <div class="alert alert-danger" *ngIf="errorMessage">
                            {{errorMessage}}
                        </div>

                        <!-- Authentication Check -->
                        <div class="alert alert-warning" *ngIf="!authService.isAuthenticated()">
                            <h4>Authentication Required</h4>
                            <p>You need to be logged in to post jobs. <a routerLink="/login">Click here to login</a></p>
                        </div>

                        <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" *ngIf="authService.isAuthenticated()">
                            <div class="form-group">
                                <label class="form-label">Job Title *</label>
                                <input
                                        type="text"
                                        class="form-control"
                                        formControlName="title"
                                        placeholder="e.g. Senior Frontend Developer"
                                        [class.is-invalid]="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">
                                <div class="invalid-feedback" *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">
                                    Job title is required
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Company Name *</label>
                                <input
                                        type="text"
                                        class="form-control"
                                        formControlName="companyName"
                                        placeholder="e.g. Tech Innovations Inc."
                                        [class.is-invalid]="jobForm.get('companyName')?.invalid && jobForm.get('companyName')?.touched">
                                <div class="invalid-feedback" *ngIf="jobForm.get('companyName')?.invalid && jobForm.get('companyName')?.touched">
                                    Company name is required
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Job Description *</label>
                                <textarea
                                        class="form-control"
                                        formControlName="description"
                                        rows="8"
                                        placeholder="Describe the role, requirements, benefits, and what makes this opportunity special..."
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
                                    {{isLoading ? 'Saving...' : (isEditing ? 'Update Job' : 'Post Job')}}
                                </button>
                                <button
                                        type="button"
                                        class="btn btn-secondary"
                                        (click)="goBack()">
                                    Cancel
                                </button>
                            </div>
                        </form>

                        <!-- Debug Information -->
                        <div class="mt-4" *ngIf="showDebugInfo">
                            <h4>Debug Information</h4>
                            <p><strong>User authenticated:</strong> {{authService.isAuthenticated()}}</p>
                            <p><strong>Current user:</strong> {{authService.getCurrentUser()?.username || 'None'}}</p>
                            <p><strong>Token exists:</strong> {{!!authService.getToken()}}</p>
                            <p><strong>Token preview:</strong> {{getTokenPreview()}}</p>
                            <p><strong>Form valid:</strong> {{jobForm.valid}}</p>
                            <p><strong>Form values:</strong> {{jobForm.value | json}}</p>
                            <p><strong>Last error:</strong> {{lastError || 'None'}}</p>
                        </div>

                        <button
                                type="button"
                                class="btn btn-secondary mt-2"
                                (click)="showDebugInfo = !showDebugInfo">
                            {{showDebugInfo ? 'Hide' : 'Show'}} Debug Info
                        </button>
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
    successMessage = '';
    isEditing = false;
    jobId: number | null = null;
    showDebugInfo = false;
    lastError = '';

    constructor(
        private fb: FormBuilder,
        private jobService: JobService,
        public authService: AuthService,
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
        
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

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
                    this.lastError = JSON.stringify(error);
                }
            });
        }
    }

    onSubmit(): void {
      

        const token = this.authService.getToken();
        

        if (!this.authService.isAuthenticated()) {
            this.errorMessage = 'You must be logged in to post jobs';
            this.router.navigate(['/login']);
            return;
        }

        if (this.jobForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';
            this.lastError = '';

            const formData = this.jobForm.value;

            if (this.isEditing && this.jobId) {
                this.jobService.updateJobPosting(this.jobId, formData).subscribe({
                    next: () => {
                        this.successMessage = 'Job updated successfully! Redirecting...';
                        this.isLoading = false;
                        setTimeout(() => {
                            this.router.navigate(['/my-jobs']);
                        }, 2000);
                    },
                    error: (error) => {
                        this.handleError(error);
                    }
                });
            } else {
                this.jobService.createJobPosting(formData).subscribe({
                    next: (response) => {
                        this.successMessage = 'Job posted successfully! You can now see it in the Browse Jobs section. Redirecting...';
                        this.isLoading = false;

                        this.jobForm.reset();

                        setTimeout(() => {
                            this.router.navigate(['/']);
                        }, 3000);
                    },
                    error: (error) => {
                        this.handleError(error);
                    }
                });
            }
        } else {
            this.errorMessage = 'Please fill in all required fields';

            Object.keys(this.jobForm.controls).forEach(key => {
                this.jobForm.get(key)?.markAsTouched();
            });
        }
    }

    private handleError(error: any): void {
        this.isLoading = false;
        this.lastError = JSON.stringify(error);


        if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Your session has expired. Please login again.';
            this.authService.logout();

            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 2000);
        } else {
            this.errorMessage = error.error?.message || error.message || 'Failed to save job posting. Please try again.';
        }
    }

    getTokenPreview(): string {
        const token = this.authService.getToken();
        if (!token) return 'No token';
        return token.substring(0, 30) + '...';
    }

    goBack(): void {
        this.router.navigate(['/my-jobs']);
    }
}