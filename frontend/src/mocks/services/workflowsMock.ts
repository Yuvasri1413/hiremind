import type { WorkflowService } from '../../api/services/types';
import { createDefaultWorkflow } from '../../data/defaultWorkflow';
import type { WorkflowGraph } from '../../types/workflow';
import { MOCK_STORAGE_KEYS, mockDelay, readMockStorage, writeMockStorage } from '../mockStorage';

function loadWorkflow(jobId: string): WorkflowGraph {
  return readMockStorage(MOCK_STORAGE_KEYS.workflow(jobId), createDefaultWorkflow());
}

export const mockWorkflowsService: WorkflowService = {
  async get(jobId) {
    return mockDelay(loadWorkflow(jobId));
  },

  async save(jobId, workflow) {
    writeMockStorage(MOCK_STORAGE_KEYS.workflow(jobId), workflow);
  },
};
