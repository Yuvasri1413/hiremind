import type { RequirementsService } from '../services/types';
import type { BackendJob } from './mappers';
import { mapRequirements } from './mappers';
import { liveFetch } from './liveFetch';

export const liveRequirementsService: RequirementsService = {
  async getByJob(job) {
    const response = await liveFetch<BackendJob>(`/jobs/${job.id}`);
    if (!response.requirements) {
      throw new Error('Job requirements not found');
    }
    return mapRequirements(response.requirements);
  },
};
