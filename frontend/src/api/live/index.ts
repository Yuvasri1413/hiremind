import type { HireMindApi } from '../services/types';
import { liveAuthService } from './auth';
import { liveCandidateReportsService } from './candidateReports';
import { liveCandidatesService } from './candidates';
import { liveJobsService } from './jobs';
import { liveRequirementsService } from './requirements';
import { liveUploadsService } from './uploads';
import { liveWorkflowsService } from './workflows';

export { getToken, setToken } from './tokenStorage';
export { liveFetch, liveUpload } from './liveFetch';

export const liveApi: HireMindApi = {
  auth: liveAuthService,
  jobs: liveJobsService,
  candidates: liveCandidatesService,
  workflows: liveWorkflowsService,
  uploads: liveUploadsService,
  requirements: liveRequirementsService,
  candidateReports: liveCandidateReportsService,
};
