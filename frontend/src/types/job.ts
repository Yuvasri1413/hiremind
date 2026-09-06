export type JobStatus = 'draft' | 'open' | 'closed';

export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  minExperience: number;
  maxExperience: number;
  status: JobStatus;
  candidateCount: number;
  avgScore: number | null;
  createdAt: string;
};

export type JobFormValues = {
  title: string;
  description: string;
  location: string;
  minExperience: number | '';
  maxExperience: number | '';
  status: JobStatus;
};

export type DashboardStats = {
  totalJobs: number;
  totalCandidates: number;
  avgScore: number;
};
