import type { Edge, Node } from '@xyflow/react';
import type { WorkflowGraph, WorkflowNodeData } from '../types/workflow';
import { defaultConfigForType } from '../types/workflow';

function node(
  id: string,
  nodeType: WorkflowNodeData['nodeType'],
  label: string,
  x: number,
  y: number,
): Node<WorkflowNodeData> {
  return {
    id,
    type: 'workflow',
    position: { x, y },
    data: {
      label,
      nodeType,
      config: defaultConfigForType(nodeType),
    },
  };
}

export function createDefaultWorkflow(): WorkflowGraph {
  const nodes: Node<WorkflowNodeData>[] = [
    node('parse-1', 'parse', 'Parse', 0, 120),
    node('screen-1', 'screen', 'Screen', 220, 120),
    node('match-1', 'match', 'Skill Match', 440, 120),
    node('evaluate-1', 'evaluate', 'Evaluate', 660, 120),
    node('rank-1', 'rank', 'Rank', 880, 120),
    node('interview-1', 'interview', 'Interview', 1100, 120),
  ];

  const edges: Edge[] = [
    { id: 'e-parse-screen', source: 'parse-1', target: 'screen-1', animated: true },
    { id: 'e-screen-match', source: 'screen-1', target: 'match-1', animated: true },
    { id: 'e-match-evaluate', source: 'match-1', target: 'evaluate-1', animated: true },
    { id: 'e-evaluate-rank', source: 'evaluate-1', target: 'rank-1', animated: true },
    { id: 'e-rank-interview', source: 'rank-1', target: 'interview-1', animated: true },
  ];

  return { nodes, edges };
}
