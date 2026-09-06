import type { CandidateReportsService } from '../../api/services/types';
import { getMockCandidateReport } from '../../data/mockCandidateReports';
import { mockDelay } from '../mockStorage';

export const mockCandidateReportsService: CandidateReportsService = {
  async getByCandidate(candidate) {
    return mockDelay(getMockCandidateReport(candidate));
  },
};
