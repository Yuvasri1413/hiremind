import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useMemo, type Dispatch, type DragEvent, type MouseEvent, type SetStateAction } from 'react';
import { useThemeMode } from '../../context/ThemeContext';
import {
  WORKFLOW_NODE_META,
  defaultConfigForType,
  type WorkflowNodeData,
  type WorkflowNodeType,
} from '../../types/workflow';
import { workflowNodeTypes } from './WorkflowNode';

type WorkflowCanvasProps = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>;
  onEdgesChange: OnEdgesChange;
  setNodes?: Dispatch<SetStateAction<Node<WorkflowNodeData>[]>>;
  setEdges?: Dispatch<SetStateAction<Edge[]>>;
  readOnly?: boolean;
  height?: number | string;
  onNodeSelect?: (node: Node<WorkflowNodeData> | null) => void;
};

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  readOnly,
  height = 520,
  onNodeSelect,
}: WorkflowCanvasProps) {
  const { tokens: t, mode } = useThemeMode();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly || !setEdges) return;
      setEdges((current) => addEdge({ ...connection, animated: true }, current));
    },
    [readOnly, setEdges],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (readOnly || !setNodes) return;

      const nodeType = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      if (!nodeType) return;

      if (nodeType === 'parse' && nodes.some((node) => node.data.nodeType === 'parse')) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const meta = WORKFLOW_NODE_META[nodeType];
      const newNode: Node<WorkflowNodeData> = {
        id: `${nodeType}-${crypto.randomUUID().slice(0, 8)}`,
        type: 'workflow',
        position,
        data: {
          label: meta.label,
          nodeType,
          config: defaultConfigForType(nodeType),
        },
      };

      setNodes((current) => current.concat(newNode));
    },
    [nodes, readOnly, screenToFlowPosition, setNodes],
  );

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node<WorkflowNodeData>) => {
      onNodeSelect?.(node);
    },
    [onNodeSelect],
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: 0,
        height,
        bgcolor: t.bgPaper,
        boxShadow: t.shadows.card,
        overflow: 'hidden',
        border: `1px solid ${t.borderGold}`,
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={workflowNodeTypes}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          fitView
          proOptions={proOptions}
          colorMode={mode}
        >
          <Background gap={16} color={mode === 'dark' ? '#333' : '#ddd'} />
          {!readOnly && <Controls />}
        </ReactFlow>
      </Box>
    </Paper>
  );
}
