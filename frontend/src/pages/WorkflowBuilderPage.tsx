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
} from '@xyflow/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { NodeConfigDrawer } from '../components/workflow/NodeConfigDrawer';
import { NodePalette } from '../components/workflow/NodePalette';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { useJobs } from '../context/JobsContext';
import { validateWorkflow } from '../utils/workflowValidation';
import type { WorkflowNodeConfig, WorkflowNodeData } from '../types/workflow';

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
            {jobTitle} — configure the recruitment pipeline
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
        <NodePalette hasParseNode={hasParseNode} />
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
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
