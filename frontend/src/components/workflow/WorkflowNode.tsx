import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { useThemeMode } from '../../context/ThemeContext';
import { WORKFLOW_NODE_META, type WorkflowNodeData } from '../../types/workflow';

export function WorkflowNode({ data, selected }: NodeProps<Node<WorkflowNodeData>>) {
  const { tokens: t } = useThemeMode();
  const meta = WORKFLOW_NODE_META[data.nodeType];

  return (
    <Box
      sx={{
        minWidth: 160,
        px: 1.5,
        py: 1.25,
        borderRadius: 1.5,
        bgcolor: t.bgSurface,
        color: 'text.primary',
        border: `1px solid ${selected ? t.gold : t.borderGold}`,
        borderLeft: `4px solid ${meta.color}`,
        boxShadow: selected ? `0 0 0 2px ${t.goldMuted}` : t.shadows.card,
      }}
    >
      {data.nodeType !== 'parse' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: meta.color, width: 10, height: 10, border: `2px solid ${t.bgSurface}` }}
        />
      )}
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {data.label}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {meta.description}
      </Typography>
      {data.nodeType !== 'interview' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: meta.color, width: 10, height: 10, border: `2px solid ${t.bgSurface}` }}
        />
      )}
    </Box>
  );
}

export const workflowNodeTypes = {
  workflow: WorkflowNode,
};
