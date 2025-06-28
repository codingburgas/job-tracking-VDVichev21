import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JobPosting, CreateJobRequest, UpdateJobRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<JobPosting[]> {
    console.log('Fetching jobs from API...');
    return this.http.get<JobPosting[]>(`${this.API_URL}/jobpostings`).pipe(
        tap(jobs => console.log('API response for jobs:', jobs)),
        catchError(this.handleError)
    );
  }

  getJob(id: number): Observable<JobPosting> {
    console.log('Fetching job with ID:', id);
    return this.http.get<JobPosting>(`${this.API_URL}/jobpostings/${id}`).pipe(
        tap(job => console.log('API response for job:', job)),
        catchError(this.handleError)
    );
  }

  createJob(job: CreateJobRequest): Observable<JobPosting> {
    console.log('Creating job:', job);
    return this.http.post<JobPosting>(`${this.API_URL}/jobpostings`, job).pipe(
        tap(createdJob => console.log('Job created:', createdJob)),
        catchError(this.handleError)
    );
  }

  updateJob(id: number, job: UpdateJobRequest): Observable<JobPosting> {
    console.log('Updating job:', id, job);
    return this.http.put<JobPosting>(`${this.API_URL}/jobpostings/${id}`, job).pipe(
        tap(updatedJob => console.log('Job updated:', updatedJob)),
        catchError(this.handleError)
    );
  }

  deleteJob(id: number): Observable<void> {
    console.log('Deleting job:', id);
    return this.http.delete<void>(`${this.API_URL}/jobpostings/${id}`).pipe(
        tap(() => console.log('Job deleted:', id)),
        catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error occurred:', error);

    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check if the API is running on http://localhost:5000';
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}