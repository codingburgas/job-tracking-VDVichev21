import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPosting, CreateJobRequest, UpdateJobRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly apiUrl = 'http://localhost:5000/api/jobpostings';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(this.apiUrl);
  }

  getJob(id: number): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${this.apiUrl}/${id}`);
  }

  createJob(request: CreateJobRequest): Observable<JobPosting> {
    return this.http.post<JobPosting>(this.apiUrl, request);
  }

  updateJob(id: number, request: UpdateJobRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}