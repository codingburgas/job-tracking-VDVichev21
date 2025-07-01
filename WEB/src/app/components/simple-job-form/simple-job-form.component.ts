import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-simple-job-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="container">
            <div class="page-header">
                <h1>Post a New Job (Simple Version)</h1>
                <p>Create a job posting without complex authentication</p>
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

                        <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
                            <div class="form-group">
                                <label class="form-label">Your Username</label>
                                <input
                                        type="text"
                                        class="form-control"
                                        formControlName="username"
                                        placeholder="Enter your username"
                                        [class.is-invalid]="jobForm.get('username')?.invalid && jobForm.get('username')?.touched">
                                <div class="invalid-feedback" *ngIf="jobForm.get('username')?.invalid && jobForm.get('username')?.touched">
                                    Username is required
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Job Title</label>
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
                                <label class="form-label">Company Name</label>
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
                                <label class="form-label">Job Description</label>
                                <textarea
                                        class="form-control"
                                        formControlName="description"
                                        rows="8"
                                        placeholder="Describe the role, requirements, benefits, and what makes this opportunity special...">
                </textarea>
                            </div>

                            <div class="flex gap-2">
                                <button
                                        type="submit"
                                        class="btn btn-primary"
                                        [disabled]="jobForm.invalid || isLoading">
                                    {{isLoading ? 'Creating Job...' : 'Post Job'}}
                                </button>
                                <button
                                        type="button"
                                        class="btn btn-secondary"
                                        (click)="goBack()">
                                    Cancel
                                </button>
                            </div>
                        </form>

                        <div class="mt-4" *ngIf="createdJob">
                            <h3>Job Created Successfully!</h3>
                            <div class="card">
                                <div class="card-body">
                                    <h4>{{createdJob.title}}</h4>
                                    <p><strong>Company:</strong> {{createdJob.companyName}}</p>
                                    <p><strong>Description:</strong> {{createdJob.description}}</p>
                                    <p><strong>Posted:</strong> {{formatDate(createdJob.datePosted)}}</p>
                                    <p><strong>Status:</strong> {{createdJob.status}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class SimpleJobFormComponent {
    jobForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    successMessage = '';
    createdJob: any = null;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router
    ) {
        this.jobForm = this.fb.group({
            username: ['', Validators.required],
            title: ['', Validators.required],
            companyName: ['', Validators.required],
            description: ['']
        });
    }

    onSubmit(): void {
        if (this.jobForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const formData = this.jobForm.value;
            console.log('🔄 Submitting simple job form:', formData);

            this.http.post<any>('http://localhost:5000/api/simplejob/create', formData)
                .subscribe({
                    next: (response) => {
                        console.log('✅ Job created successfully:', response);
                        this.successMessage = response.message || 'Job posted successfully!';
                        this.createdJob = response.job;
                        this.isLoading = false;

                        // Reset form
                        this.jobForm.reset();

                        // Scroll to top to show success message
                        window.scrollTo(0, 0);
                    },
                    error: (error) => {
                        console.error('❌ Error creating job:', error);
                        this.errorMessage = error.error?.message || 'Failed to create job posting';
                        this.isLoading = false;
                    }
                });
        }
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString();
    }
}