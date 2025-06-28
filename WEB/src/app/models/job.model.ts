export interface JobPosting {
  id: number;
  title: string;
  companyName: string;
  description: string;
  publishedDate: Date;
  status: string;
  createdByName: string;
  applicationsCount: number;
}

export interface CreateJobRequest {
  title: string;
  companyName: string;
  description: string;
}

export interface UpdateJobRequest {
  title: string;
  companyName: string;
  description: string;
  status: string;
}