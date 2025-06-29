export interface JobPosting {
  id: number;
  title: string;
  company: string;
  description: string;
  datePosted: string;
  status: JobStatus;
  applicationCount: number;
  userHasApplied: boolean;
}

export enum JobStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface CreateJobRequest {
  title: string;
  company: string;
  description: string;
}

export interface UpdateJobRequest {
  title?: string;
  company?: string;
  description?: string;
  status?: JobStatus;
}