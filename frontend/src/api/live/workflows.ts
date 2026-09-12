import type { WorkflowService } from '../services/types';
import type { BackendWorkflow } from './mappers';
import { mapWorkflow } from './mappers';
import { liveFetch } from './liveFetch';

export const liveWorkflowsService: WorkflowService = {
  async get(jobId) {
    const workflow = await liveFetch<BackendWorkflow>(`/jobs/${jobId}/workflow`);
    return mapWorkflow(workflow);
  },

  async save(jobId, workflow) {
    await liveFetch(`/jobs/${jobId}/workflow`, {
      method: 'PUT',
      body: JSON.stringify({
        nodes: workflow.nodes,
        edges: workflow.edges,
      }),
    });
  },
};
