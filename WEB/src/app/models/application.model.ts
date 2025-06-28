export interface Application {
  id: number;
  userId: number;
  userName: string;
  jobPostingId: number;
  jobTitle: string;
  companyName: string;
  status: string;
  submittedAt: Date;
  updatedAt?: Date;
}

export interface UpdateApplicationStatusRequest {
  status: string;
}