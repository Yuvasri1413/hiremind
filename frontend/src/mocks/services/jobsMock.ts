import type { JobsService } from '../../api/services/types';
import { initialJobs } from '../../data/initialJobs';
import type { DashboardStats, Job, JobFormValues } from '../../types/job';
import { MOCK_STORAGE_KEYS, mockDelay, readMockStorage, writeMockStorage } from '../mockStorage';

function loadJobs(): Job[] {
  return readMockStorage(MOCK_STORAGE_KEYS.jobs, initialJobs);
}

function saveJobs(jobs: Job[]) {
  writeMockStorage(MOCK_STORAGE_KEYS.jobs, jobs);
}

function computeStats(jobs: Job[]): DashboardStats {
  const totalCandidates = jobs.reduce((sum, job) => sum + job.candidateCount, 0);
  const scored = jobs.filter((job) => job.avgScore !== null);
  const avgScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, job) => sum + (job.avgScore ?? 0), 0) / scored.length)
      : 0;

  return {
    totalJobs: jobs.length,
    totalCandidates,
    avgScore,
  };
}

function buildJob(values: JobFormValues): Job {
  return {
    id: crypto.randomUUID(),
    title: values.title.trim(),
    description: values.description.trim(),
    location: values.location.trim() || 'Not specified',
    minExperience: values.minExperience === '' ? 0 : values.minExperience,
    maxExperience: values.maxExperience === '' ? 0 : values.maxExperience,
    status: values.status,
    candidateCount: 0,
    avgScore: null,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

function applyFormValues(job: Job, values: JobFormValues): Job {
  return {
    ...job,
    title: values.title.trim(),
    description: values.description.trim(),
    location: values.location.trim() || 'Not specified',
    minExperience: values.minExperience === '' ? 0 : values.minExperience,
    maxExperience: values.maxExperience === '' ? 0 : values.maxExperience,
    status: values.status,
  };
}

export const mockJobsService: JobsService = {
  async list() {
    return mockDelay(loadJobs());
  },

  async get(id) {
    const job = loadJobs().find((entry) => entry.id === id) ?? null;
    return mockDelay(job);
  },

  async create(values) {
    const jobs = loadJobs();
    const newJob = buildJob(values);
    saveJobs([newJob, ...jobs]);
    return mockDelay(newJob);
  },

  async update(id, values) {
    const jobs = loadJobs();
    const index = jobs.findIndex((job) => job.id === id);
    if (index === -1) throw new Error('Job not found');

    const updated = applyFormValues(jobs[index], values);
    const next = [...jobs];
    next[index] = updated;
    saveJobs(next);
    return mockDelay(updated);
  },

  async delete(id) {
    saveJobs(loadJobs().filter((job) => job.id !== id));
  },

  async getStats() {
    return mockDelay(computeStats(loadJobs()));
  },
};
