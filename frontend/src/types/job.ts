export type JobStatus = 'draft' | 'open' | 'closed';

export type Job = {
  id: string;
  title: string;
  location: string;
  status: JobStatus;
  candidateCount: number;
  avgScore: number | null;
  createdAt: string;
};

export type DashboardStats = {
  totalJobs: number;
  totalCandidates: number;
  avgScore: number;
};
