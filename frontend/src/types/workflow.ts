import type { Edge, Node } from '@xyflow/react';

export type WorkflowNodeType =
  | 'parse'
  | 'screen'
  | 'match'
  | 'evaluate'
  | 'rank'
  | 'interview';

export type WorkflowNodeConfig = {
  screenThreshold?: number;
  requiredWeight?: number;
  preferredWeight?: number;
  skillsWeight?: number;
  experienceWeight?: number;
  educationWeight?: number;
  projectsWeight?: number;
  screeningWeight?: number;
  matchWeight?: number;
  evaluationWeight?: number;
  technicalQuestions?: number;
  behavioralQuestions?: number;
  gapQuestions?: number;
};

export type WorkflowNodeData = {
  label: string;
  nodeType: WorkflowNodeType;
  config: WorkflowNodeConfig;
};

export type WorkflowGraph = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
};

export type WorkflowNodeMeta = {
  type: WorkflowNodeType;
  label: string;
  description: string;
  color: string;
};

export const WORKFLOW_NODE_META: Record<WorkflowNodeType, WorkflowNodeMeta> = {
  parse: {
    type: 'parse',
    label: 'Parse',
    description: 'Extract structured data from resumes',
    color: '#1565C0',
  },
  screen: {
    type: 'screen',
    label: 'Screen',
    description: 'Filter candidates by relevance threshold',
    color: '#FFA000',
  },
  match: {
    type: 'match',
    label: 'Skill Match',
    description: 'Compare skills against job requirements',
    color: '#2E7D32',
  },
  evaluate: {
    type: 'evaluate',
    label: 'Evaluate',
    description: 'Holistic candidate assessment',
    color: '#6A1B9A',
  },
  rank: {
    type: 'rank',
    label: 'Rank',
    description: 'Rank candidates by composite scores',
    color: '#ED6C02',
  },
  interview: {
    type: 'interview',
    label: 'Interview',
    description: 'Generate tailored interview questions',
    color: '#00838F',
  },
};

export const PALETTE_NODE_TYPES: WorkflowNodeType[] = [
  'parse',
  'screen',
  'match',
  'evaluate',
  'rank',
  'interview',
];

export function defaultConfigForType(nodeType: WorkflowNodeType): WorkflowNodeConfig {
  switch (nodeType) {
    case 'screen':
      return { screenThreshold: 60 };
    case 'match':
      return { requiredWeight: 70, preferredWeight: 30 };
    case 'evaluate':
      return {
        skillsWeight: 40,
        experienceWeight: 25,
        educationWeight: 20,
        projectsWeight: 15,
      };
    case 'rank':
      return { screeningWeight: 20, matchWeight: 40, evaluationWeight: 40 };
    case 'interview':
      return { technicalQuestions: 3, behavioralQuestions: 2, gapQuestions: 2 };
    default:
      return {};
  }
}
