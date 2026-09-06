import type { HireMindApi } from '../api/services/types';
import { mockAuthService } from './services/authMock';
import { mockCandidateReportsService } from './services/candidateReportsMock';
import { mockCandidatesService } from './services/candidatesMock';
import { mockJobsService } from './services/jobsMock';
import { mockRequirementsService } from './services/requirementsMock';
import { mockUploadsService } from './services/uploadsMock';
import { mockWorkflowsService } from './services/workflowsMock';

export const mockApi: HireMindApi = {
  auth: mockAuthService,
  jobs: mockJobsService,
  candidates: mockCandidatesService,
  workflows: mockWorkflowsService,
  uploads: mockUploadsService,
  requirements: mockRequirementsService,
  candidateReports: mockCandidateReportsService,
};
