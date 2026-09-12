import type { CandidatesService } from '../services/types';
import type { BackendCandidate } from './mappers';
import { mapCandidate } from './mappers';
import { liveFetch } from './liveFetch';
import { liveJobsService } from './jobs';

export const liveCandidatesService: CandidatesService = {
  async list() {
    const jobs = await liveJobsService.list();
    const lists = await Promise.all(
      jobs.map((job) => liveFetch<{ items: BackendCandidate[] }>(`/jobs/${job.id}/candidates`)),
    );
    return lists.flatMap((response) => response.items.map(mapCandidate));
  },

  async listByJob(jobId) {
    const response = await liveFetch<{ items: BackendCandidate[] }>(`/jobs/${jobId}/candidates`);
    return response.items.map(mapCandidate);
  },

  async get(id) {
    try {
      const candidate = await liveFetch<BackendCandidate>(`/candidates/${id}`);
      return mapCandidate(candidate);
    } catch {
      return null;
    }
  },
};
