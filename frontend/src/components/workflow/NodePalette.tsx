import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { DragEvent } from 'react';
import { PALETTE_NODE_TYPES, WORKFLOW_NODE_META, type WorkflowNodeType } from '../../types/workflow';
import { useThemeMode } from '../../context/ThemeContext';

type NodePaletteProps = {
  hasParseNode: boolean;
  readOnly?: boolean;
  onAddNode?: (nodeType: WorkflowNodeType) => void;
};

export function NodePalette({ hasParseNode, readOnly, onAddNode }: NodePaletteProps) {
  const { tokens: t } = useThemeMode();

  if (readOnly) return null;

  function onDragStart(event: DragEvent, nodeType: WorkflowNodeType) {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <Paper
      sx={{
        width: 220,
        flexShrink: 0,
        bgcolor: t.bgPaper,
        boxShadow: t.shadows.card,
        p: 2,
        alignSelf: 'stretch',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Node Palette
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Drag onto the canvas, or click Add. Each job has its own saved workflow.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {PALETTE_NODE_TYPES.map((nodeType) => {
          const meta = WORKFLOW_NODE_META[nodeType];
          const disabled = nodeType === 'parse' && hasParseNode;

          return (
            <Box
              key={nodeType}
              draggable={!disabled}
              onDragStart={(event) => onDragStart(event, nodeType)}
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 1.5,
                border: `1px solid ${t.borderGold}`,
                borderLeft: `4px solid ${meta.color}`,
                cursor: disabled ? 'not-allowed' : 'grab',
                opacity: disabled ? 0.5 : 1,
                bgcolor: t.bgSurface,
                '&:hover': disabled ? undefined : { bgcolor: t.goldMuted },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {meta.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: disabled ? 0 : 1 }}>
                {disabled ? 'Parse node already added' : meta.description}
              </Typography>
              {!disabled && onAddNode && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => onAddNode(nodeType)}
                  sx={{ mt: 0.5 }}
                >
                  Add
                </Button>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
