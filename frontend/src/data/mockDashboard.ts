import type { DashboardStats, Job } from '../types/job';

export const mockDashboardStats: DashboardStats = {
  totalJobs: 12,
  totalCandidates: 148,
  avgScore: 74,
};

export const mockRecentJobs: Job[] = [
  {
    id: '1',
    title: 'Backend Developer',
    location: 'Remote',
    status: 'open',
    candidateCount: 24,
    avgScore: 78,
    createdAt: '2026-09-01',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    location: 'Bangalore',
    status: 'open',
    candidateCount: 18,
    avgScore: 71,
    createdAt: '2026-09-03',
  },
  {
    id: '3',
    title: 'Data Analyst',
    location: 'Mumbai',
    status: 'closed',
    candidateCount: 32,
    avgScore: 65,
    createdAt: '2026-08-20',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    location: 'Hyderabad',
    status: 'draft',
    candidateCount: 0,
    avgScore: null,
    createdAt: '2026-09-05',
  },
];
