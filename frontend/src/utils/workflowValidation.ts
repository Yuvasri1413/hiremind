import type { Edge, Node } from '@xyflow/react';
import type { WorkflowNodeData } from '../types/workflow';

export type WorkflowValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): WorkflowValidationResult {
  const errors: string[] = [];

  const parseNodes = nodes.filter((node) => node.data.nodeType === 'parse');
  if (parseNodes.length === 0) {
    errors.push('Workflow must include a Parse node.');
  }
  if (parseNodes.length > 1) {
    errors.push('Only one Parse node is allowed.');
  }

  if (hasCycle(nodes, edges)) {
    errors.push('Workflow contains a cycle. Pipeline must flow in one direction.');
  }

  const disconnected = findDisconnectedNodes(nodes, edges);
  if (nodes.length > 1 && disconnected.length > 0) {
    errors.push('All nodes must be connected to the pipeline.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function hasCycle(nodes: Node<WorkflowNodeData>[], edges: Edge[]): boolean {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visiting.add(nodeId);
    for (const next of adjacency.get(nodeId) ?? []) {
      if (dfs(next)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (dfs(node.id)) return true;
  }
  return false;
}

function findDisconnectedNodes(nodes: Node<WorkflowNodeData>[], edges: Edge[]) {
  if (nodes.length <= 1) return [];

  const connected = new Set<string>();
  for (const edge of edges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }

  return nodes.filter((node) => !connected.has(node.id)).map((node) => node.id);
}
