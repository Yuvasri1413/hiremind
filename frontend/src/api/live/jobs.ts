import type { JobsService } from '../services/types';
import type { BackendJob } from './mappers';
import { mapJob, toJobCreatePayload } from './mappers';
import { liveFetch } from './liveFetch';

export const liveJobsService: JobsService = {
  async list() {
    const response = await liveFetch<{ items: BackendJob[] }>('/jobs');
    return response.items.map(mapJob);
  },

  async get(id) {
    try {
      const job = await liveFetch<BackendJob>(`/jobs/${id}`);
      return mapJob(job);
    } catch {
      return null;
    }
  },

  async create(values) {
    const job = await liveFetch<BackendJob>('/jobs', {
      method: 'POST',
      body: JSON.stringify(toJobCreatePayload(values)),
    });
    return mapJob(job);
  },

  async update(id, values) {
    const job = await liveFetch<BackendJob>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toJobCreatePayload(values)),
    });
    return mapJob(job);
  },

  async delete(id) {
    await liveFetch(`/jobs/${id}`, { method: 'DELETE' });
  },

  async getStats() {
    const stats = await liveFetch<{
      total_jobs: number;
      total_candidates: number;
      avg_score: number;
    }>('/dashboard/stats');

    return {
      totalJobs: stats.total_jobs,
      totalCandidates: stats.total_candidates,
      avgScore: stats.avg_score,
    };
  },
};
