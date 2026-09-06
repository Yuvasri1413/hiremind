import type { RequirementsService } from '../../api/services/types';
import { getMockJobRequirements } from '../../data/mockJobRequirements';
import { mockDelay } from '../mockStorage';

export const mockRequirementsService: RequirementsService = {
  async getByJob(job) {
    return mockDelay(getMockJobRequirements(job));
  },
};
