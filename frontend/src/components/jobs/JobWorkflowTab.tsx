import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ReactFlowProvider, useEdgesState, useNodesState, type Edge, type Node } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../../api';
import { useThemeMode } from '../../context/ThemeContext';
import { WORKFLOW_NODE_META } from '../../types/workflow';
import type { WorkflowNodeData } from '../../types/workflow';
import { WorkflowCanvas } from '../workflow/WorkflowCanvas';

type JobWorkflowTabProps = {
  jobId: string;
};

function WorkflowPreviewCanvas({ jobId }: { jobId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.workflows.get(jobId).then((workflow) => {
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setReady(true);
    });
  }, [jobId, setNodes, setEdges]);

  if (!ready) return null;

  return (
    <WorkflowCanvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      readOnly
      height={360}
    />
  );
}

export function JobWorkflowTab({ jobId }: JobWorkflowTabProps) {
  const { tokens: t } = useThemeMode();
  const [stageLabels, setStageLabels] = useState<string[]>([]);
  const [meta, setMeta] = useState({ nodes: 0, edges: 0 });

  useEffect(() => {
    api.workflows.get(jobId).then((workflow) => {
      setStageLabels(workflow.nodes.map((node) => WORKFLOW_NODE_META[node.data.nodeType].label));
      setMeta({ nodes: workflow.nodes.length, edges: workflow.edges.length });
    });
  }, [jobId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, p: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccountTreeOutlinedIcon color="primary" />
            <Box>
              <Typography variant="h6">Current Pipeline</Typography>
              <Typography variant="body2" color="text.secondary">
                {meta.nodes} stages · {meta.edges} connections
              </Typography>
            </Box>
          </Box>
          <Button
            component={RouterLink}
            to={`/jobs/${jobId}/workflow`}
            variant="contained"
            endIcon={<OpenInNewOutlinedIcon />}
          >
            Open Workflow Builder
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {stageLabels.map((label, index) => (
            <Box key={`${label}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={label} size="small" color="primary" variant="outlined" />
              {index < stageLabels.length - 1 && (
                <Typography variant="caption" color="text.disabled">
                  →
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      <ReactFlowProvider>
        <WorkflowPreviewCanvas jobId={jobId} />
      </ReactFlowProvider>
    </Box>
  );
}
