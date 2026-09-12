import type { CandidateReportsService } from '../services/types';
import type { BackendReport } from './mappers';
import { mapCandidateReport } from './mappers';
import { liveFetch } from './liveFetch';

export const liveCandidateReportsService: CandidateReportsService = {
  async getByCandidate(candidate) {
    const report = await liveFetch<BackendReport>(`/candidates/${candidate.id}/report`);
    return mapCandidateReport(report);
  },
};
