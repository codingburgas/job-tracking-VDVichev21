export interface JobPosting {
  id: number;
  title: string;
  companyName: string;
  description: string;
  datePosted: string;
  status: 'Active' | 'Inactive';
  postedByUserId: number;
  postedByUserName: string;
  canEdit: boolean;
}

export interface CreateJobPosting {
  title: string;
  companyName: string;
  description: string;
}

export interface Application {
  id: number;
  jobPostingId: number;
  jobTitle: string;
  companyName: string;
  userId: number;
  userName: string;
  status: 'Submitted' | 'SelectedForInterview' | 'Rejected';
  dateApplied: string;
  resumeFileName?: string;
  resumeFilePath?: string;
}