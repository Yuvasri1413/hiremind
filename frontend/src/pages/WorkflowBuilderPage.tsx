import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import {
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type OnNodesChange,
} from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { NodeConfigDrawer } from '../components/workflow/NodeConfigDrawer';
import { NodePalette } from '../components/workflow/NodePalette';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { useJobs } from '../context/JobsContext';
import { validateWorkflow } from '../utils/workflowValidation';
import type {
  WorkflowNodeConfig,
  WorkflowNodeData,
  WorkflowNodeType,
} from '../types/workflow';
import { WORKFLOW_NODE_META, defaultConfigForType } from '../types/workflow';

function WorkflowBuilderEditor({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [ready, setReady] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setReady(false);
    api.workflows.get(jobId).then((workflow) => {
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setReady(true);
    });
  }, [jobId, setNodes, setEdges]);

  const hasParseNode = nodes.some((node) => node.data.nodeType === 'parse');

  const handleNodesChange: OnNodesChange<Node<WorkflowNodeData>> = useCallback(
    (changes) => {
      onNodesChange(changes);
      const removedIds = changes
        .filter((change) => change.type === 'remove')
        .map((change) => change.id);
      if (removedIds.length === 0) return;

      setEdges((current) =>
        current.filter(
          (edge) => !removedIds.includes(edge.source) && !removedIds.includes(edge.target),
        ),
      );
      setSelectedNode((current) => (current && removedIds.includes(current.id) ? null : current));
    },
    [onNodesChange, setEdges],
  );

  const addNodeFromPalette = useCallback(
    (nodeType: WorkflowNodeType) => {
      if (nodeType === 'parse' && hasParseNode) return;

      const meta = WORKFLOW_NODE_META[nodeType];
      const offset = nodes.length;
      const newNode: Node<WorkflowNodeData> = {
        id: `${nodeType}-${crypto.randomUUID().slice(0, 8)}`,
        type: 'workflow',
        position: { x: 100 + (offset % 3) * 220, y: 80 + Math.floor(offset / 3) * 120 },
        data: {
          label: meta.label,
          nodeType,
          config: defaultConfigForType(nodeType),
        },
      };
      setNodes((current) => current.concat(newNode));
    },
    [hasParseNode, nodes.length, setNodes],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((current) => current.filter((node) => node.id !== nodeId));
      setEdges((current) =>
        current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
      setSelectedNode(null);
    },
    [setEdges, setNodes],
  );

  function handleConfigChange(nodeId: string, config: WorkflowNodeConfig) {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, config } } : node,
      ),
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode((current) =>
        current ? { ...current, data: { ...current.data, config } } : current,
      );
    }
  }

  function handleSave() {
    const result = validateWorkflow(nodes, edges);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    void api.workflows.save(jobId, { nodes, edges }).then(() => setSaved(true));
  }

  const liveSelectedNode =
    selectedNode ? nodes.find((node) => node.id === selectedNode.id) ?? null : null;

  if (!ready) return null;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Button
            component={RouterLink}
            to={`/jobs/${jobId}`}
            state={{ tab: 'workflow' }}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1 }}
          >
            Job Detail
          </Button>
          <Typography variant="h4" gutterBottom>
            Workflow Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {jobTitle} — this pipeline is saved only for this job. Connect nodes left → right,
            then Save. Re-process candidates after major changes.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave}>
          Save Workflow
        </Button>
      </Box>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((error) => (
            <Typography key={error} variant="body2">
              {error}
            </Typography>
          ))}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, minHeight: 560 }}>
        <NodePalette hasParseNode={hasParseNode} onAddNode={addNodeFromPalette} />
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodeSelect={setSelectedNode}
          height={560}
        />
      </Box>

      <NodeConfigDrawer
        open={Boolean(liveSelectedNode)}
        node={liveSelectedNode}
        onClose={() => setSelectedNode(null)}
        onConfigChange={handleConfigChange}
        onDeleteNode={deleteNode}
      />

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        message="Workflow saved"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export function WorkflowBuilderPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJob } = useJobs();

  const job = jobId ? getJob(jobId) : undefined;
  if (!job) return <Navigate to="/jobs" replace />;

  return (
    <ReactFlowProvider>
      <WorkflowBuilderEditor jobId={job.id} jobTitle={job.title} />
    </ReactFlowProvider>
  );
}
