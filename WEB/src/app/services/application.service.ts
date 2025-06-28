import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, UpdateApplicationStatusRequest } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.API_URL}/applications`);
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.API_URL}/applications/job/${jobId}`);
  }

  applyForJob(jobId: number): Observable<Application> {
    return this.http.post<Application>(`${this.API_URL}/applications/apply/${jobId}`, {});
  }

  updateApplicationStatus(id: number, status: UpdateApplicationStatusRequest): Observable<Application> {
    return this.http.put<Application>(`${this.API_URL}/applications/${id}/status`, status);
  }

  checkIfApplied(jobId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/applications/check/${jobId}`);
  }
}