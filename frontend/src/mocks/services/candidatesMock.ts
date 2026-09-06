import type { CandidatesService } from '../../api/services/types';
import { initialCandidates } from '../../data/initialCandidates';
import { MOCK_STORAGE_KEYS, mockDelay, readMockStorage } from '../mockStorage';

function loadCandidates() {
  return readMockStorage(MOCK_STORAGE_KEYS.candidates, initialCandidates);
}

export const mockCandidatesService: CandidatesService = {
  async list() {
    return mockDelay(loadCandidates());
  },

  async listByJob(jobId) {
    return mockDelay(loadCandidates().filter((candidate) => candidate.jobId === jobId));
  },

  async get(id) {
    const candidate = loadCandidates().find((entry) => entry.id === id) ?? null;
    return mockDelay(candidate);
  },
};
