import type { Recruiter, StoredUser } from '../../types/auth';
import type { Candidate } from '../../types/candidate';
import type { CandidateReport } from '../../types/candidateReport';
import type { JobRequirements } from '../../types/jobRequirements';
import type { DashboardStats, Job, JobFormValues } from '../../types/job';
import type { ResumeUploadItem } from '../../types/upload';
import type { WorkflowGraph } from '../../types/workflow';

export type AuthService = {
  getSession: () => Promise<Recruiter | null>;
  login: (email: string, password: string) => Promise<Recruiter>;
  register: (name: string, email: string, password: string) => Promise<Recruiter>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<PasswordResetResponse>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
};

export type PasswordResetResponse = {
  message: string;
  /** Mock/demo only — lets the UI link straight to reset without email */
  resetToken?: string;
  email?: string;
};

export type JobsService = {
  list: () => Promise<Job[]>;
  get: (id: string) => Promise<Job | null>;
  create: (values: JobFormValues) => Promise<Job>;
  update: (id: string, values: JobFormValues) => Promise<Job>;
  delete: (id: string) => Promise<void>;
  getStats: () => Promise<DashboardStats>;
};

export type CandidatesService = {
  list: () => Promise<Candidate[]>;
  listByJob: (jobId: string) => Promise<Candidate[]>;
  get: (id: string) => Promise<Candidate | null>;
};

export type WorkflowService = {
  get: (jobId: string) => Promise<WorkflowGraph>;
  save: (jobId: string, workflow: WorkflowGraph) => Promise<void>;
};

export type UploadsService = {
  list: (jobId: string) => Promise<ResumeUploadItem[]>;
  save: (jobId: string, uploads: ResumeUploadItem[]) => Promise<void>;
};

export type RequirementsService = {
  getByJob: (job: Job) => Promise<JobRequirements>;
};

export type CandidateReportsService = {
  getByCandidate: (candidate: Candidate) => Promise<CandidateReport>;
};

export type HireMindApi = {
  auth: AuthService;
  jobs: JobsService;
  candidates: CandidatesService;
  workflows: WorkflowService;
  uploads: UploadsService;
  requirements: RequirementsService;
  candidateReports: CandidateReportsService;
};

export type { StoredUser };
