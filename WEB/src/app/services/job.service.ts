import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPosting, CreateJobPosting, Application } from '../models/job.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getJobPostings(): Observable<JobPosting[]> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching job postings');
    }
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobpostings`);
  }

  getAllJobPostings(): Observable<JobPosting[]> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching all job postings');
    }
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobpostings/all`);
  }

  getMyJobPostings(): Observable<JobPosting[]> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching my job postings');
    }
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobpostings/my`);
  }

  getJobPosting(id: number): Observable<JobPosting> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching job posting:', id);
    }
    return this.http.get<JobPosting>(`${this.apiUrl}/jobpostings/${id}`);
  }

  createJobPosting(job: CreateJobPosting): Observable<JobPosting> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Creating job posting:', job);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<JobPosting>(`${this.apiUrl}/jobpostings`, job, { headers });
  }

  updateJobPosting(id: number, job: CreateJobPosting): Observable<void> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Updating job posting:', id, job);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.apiUrl}/jobpostings/${id}`, job, { headers });
  }

  updateJobStatus(id: number, status: 'Active' | 'Inactive'): Observable<void> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Updating job status:', id, status);
    }

    return this.http.put<void>(`${this.apiUrl}/jobpostings/${id}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteJobPosting(id: number): Observable<void> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Deleting job posting:', id);
    }
    return this.http.delete<void>(`${this.apiUrl}/jobpostings/${id}`);
  }

  applyForJob(id: number, resumeFile?: File | null): Observable<void> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Applying for job:', id, 'with resume:', !!resumeFile);
    }

    const formData = new FormData();
    if (resumeFile) {
      formData.append('resumeFile', resumeFile);
    }

    return this.http.post<void>(`${this.apiUrl}/jobpostings/${id}/apply`, formData);
  }

  getJobApplications(id: number): Observable<Application[]> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching job applications for job:', id);
    }
    return this.http.get<Application[]>(`${this.apiUrl}/jobpostings/${id}/applications`);
  }

  getMyApplications(): Observable<Application[]> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching my applications');
    }
    return this.http.get<Application[]>(`${this.apiUrl}/applications/my`);
  }

  getReceivedApplications(): Observable<Application[]> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Fetching received applications');
    }
    return this.http.get<Application[]>(`${this.apiUrl}/applications/received`);
  }

  updateApplicationStatus(id: number, status: 'Submitted' | 'SelectedForInterview' | 'Rejected'): Observable<void> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Updating application status:', id, status);
    }

    return this.http.put<void>(`${this.apiUrl}/applications/${id}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  downloadResume(applicationId: number): Observable<Blob> {
    if (environment.features.enableConsoleLogging) {
      console.log('🔄 Downloading resume for application:', applicationId);
    }

    return this.http.get(`${this.apiUrl}/jobpostings/applications/${applicationId}/resume`, {
      responseType: 'blob'
    });
  }
}