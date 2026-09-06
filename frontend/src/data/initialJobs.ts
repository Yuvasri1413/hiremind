import type { Job } from '../types/job';

export const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Backend Developer',
    description:
      'We are looking for a Python developer with FastAPI and PostgreSQL experience to build scalable APIs.',
    location: 'Remote',
    minExperience: 2,
    maxExperience: 5,
    status: 'open',
    candidateCount: 24,
    avgScore: 78,
    createdAt: '2026-09-01',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    description:
      'Join our team to build modern React applications with TypeScript and Material UI.',
    location: 'Bangalore',
    minExperience: 1,
    maxExperience: 4,
    status: 'open',
    candidateCount: 18,
    avgScore: 71,
    createdAt: '2026-09-03',
  },
  {
    id: '3',
    title: 'Data Analyst',
    description:
      'Analyze recruitment metrics and candidate pipeline data. SQL and Excel required.',
    location: 'Mumbai',
    minExperience: 2,
    maxExperience: 6,
    status: 'closed',
    candidateCount: 32,
    avgScore: 65,
    createdAt: '2026-08-20',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description:
      'Manage CI/CD pipelines, Docker, and cloud infrastructure for our hiring platform.',
    location: 'Hyderabad',
    minExperience: 3,
    maxExperience: 7,
    status: 'draft',
    candidateCount: 0,
    avgScore: null,
    createdAt: '2026-09-05',
  },
  {
    id: '5',
    title: 'UI Designer',
    description:
      'Design elegant recruiter dashboards and workflow builder interfaces.',
    location: 'Mumbai',
    minExperience: 1,
    maxExperience: 3,
    status: 'draft',
    candidateCount: 0,
    avgScore: null,
    createdAt: '2026-09-04',
  },
];
