export type CandidateStatus =
  | 'pending'
  | 'parsing'
  | 'screening'
  | 'skill_match'
  | 'evaluating'
  | 'ranked'
  | 'completed'
  | 'filtered_out'
  | 'failed';

export type Candidate = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  experienceYears: number;
  status: CandidateStatus;
  rank: number | null;
  matchScore: number | null;
  evalScore: number | null;
  overallScore: number | null;
  resumeFileName?: string;
  parseError?: string | null;
  addedAt: string;
};

export type CandidateSort = 'rank' | 'name' | 'overall';

export type CandidateStatusFilter = CandidateStatus | 'all' | 'in_progress';

export const IN_PROGRESS_STATUSES: CandidateStatus[] = [
  'parsing',
  'screening',
  'skill_match',
  'evaluating',
  'ranked',
];
