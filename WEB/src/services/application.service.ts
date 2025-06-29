import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, CreateApplicationRequest, UpdateApplicationStatusRequest } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiUrl = 'http://localhost:5000/api/applications';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplicationsByJob(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/job/${jobId}`);
  }

  createApplication(request: CreateApplicationRequest): Observable<Application> {
    const formData = new FormData();
    formData.append('jobPostingId', request.jobPostingId.toString());

    if (request.resumeFile) {
      formData.append('resumeFile', request.resumeFile);
    }

    return this.http.post<Application>(this.apiUrl, formData);
  }

  updateApplicationStatus(id: number, request: UpdateApplicationStatusRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, request);
  }

  downloadResume(applicationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-resume/${applicationId}`, {
      responseType: 'blob'
    });
  }
}   