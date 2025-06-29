export interface Application {
  id: number;
  userId: number;
  jobPostingId: number;
  status: ApplicationStatus;
  submittedAt: string;
  userName: string;
  jobTitle: string;
  company: string;
  resumeFileName?: string;
  resumeFilePath?: string;
}

export enum ApplicationStatus {
  Submitted = 'Submitted',
  SelectedForInterview = 'SelectedForInterview',
  Rejected = 'Rejected'
}

export interface CreateApplicationRequest {
  jobPostingId: number;
  resumeFile?: File;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}