import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Node } from '@xyflow/react';
import { useThemeMode } from '../../context/ThemeContext';
import {
  WORKFLOW_NODE_META,
  type WorkflowNodeConfig,
  type WorkflowNodeData,
} from '../../types/workflow';

type NodeConfigDrawerProps = {
  open: boolean;
  node: Node<WorkflowNodeData> | null;
  onClose: () => void;
  onConfigChange: (nodeId: string, config: WorkflowNodeConfig) => void;
  onDeleteNode?: (nodeId: string) => void;
  readOnly?: boolean;
};

function ConfigSlider({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}: {value}
      </Typography>
      <Slider
        value={value}
        min={0}
        max={100}
        disabled={readOnly}
        onChange={(_, val) => onChange(val as number)}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

function ConfigNumberField({
  label,
  value,
  onChange,
  readOnly,
  min = 1,
  max = 10,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <TextField
      label={label}
      type="number"
      size="small"
      fullWidth
      disabled={readOnly}
      value={value}
      slotProps={{ htmlInput: { min, max } }}
      onChange={(e) => {
        const next = Number(e.target.value);
        if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)));
      }}
      sx={{ mb: 2 }}
    />
  );
}

export function NodeConfigDrawer({
  open,
  node,
  onClose,
  onConfigChange,
  onDeleteNode,
  readOnly,
}: NodeConfigDrawerProps) {
  const { tokens: t } = useThemeMode();

  if (!node) return null;

  const { nodeType, config } = node.data;
  const meta = WORKFLOW_NODE_META[nodeType];

  function update(partial: Partial<WorkflowNodeConfig>) {
    onConfigChange(node!.id, { ...config, ...partial });
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {meta.label} Config
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {readOnly ? 'View node settings' : 'Click save workflow to persist changes'}
        </Typography>
        <Divider sx={{ borderColor: t.borderGold, mb: 2 }} />

        {!readOnly && onDeleteNode && (
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteOutlinedIcon />}
            fullWidth
            sx={{ mb: 2 }}
            onClick={() => {
              onDeleteNode(node.id);
              onClose();
            }}
          >
            Delete node
          </Button>
        )}

        {nodeType === 'parse' && (
          <Typography variant="body2" color="text.secondary">
            Parse is required and has no configurable fields.
          </Typography>
        )}

        {nodeType === 'screen' && (
          <ConfigSlider
            label="Screen threshold"
            value={config.screenThreshold ?? 60}
            onChange={(value) => update({ screenThreshold: value })}
            readOnly={readOnly}
          />
        )}

        {nodeType === 'match' && (
          <>
            <ConfigSlider
              label="Required skills weight"
              value={config.requiredWeight ?? 70}
              onChange={(value) => update({ requiredWeight: value })}
              readOnly={readOnly}
            />
            <ConfigSlider
              label="Preferred skills weight"
              value={config.preferredWeight ?? 30}
              onChange={(value) => update({ preferredWeight: value })}
              readOnly={readOnly}
            />
          </>
        )}

        {nodeType === 'evaluate' && (
          <>
            <ConfigSlider
              label="Skills weight"
              value={config.skillsWeight ?? 40}
              onChange={(value) => update({ skillsWeight: value })}
              readOnly={readOnly}
            />
            <ConfigSlider
              label="Experience weight"
              value={config.experienceWeight ?? 25}
              onChange={(value) => update({ experienceWeight: value })}
              readOnly={readOnly}
            />
            <ConfigSlider
              label="Education weight"
              value={config.educationWeight ?? 20}
              onChange={(value) => update({ educationWeight: value })}
              readOnly={readOnly}
            />
            <ConfigSlider
              label="Projects weight"
              value={config.projectsWeight ?? 15}
              onChange={(value) => update({ projectsWeight: value })}
              readOnly={readOnly}
            />
          </>
        )}

        {nodeType === 'rank' && (
          <>
            <ConfigSlider
              label="Screening weight"
              value={config.screeningWeight ?? 20}
              onChange={(value) => update({ screeningWeight: value })}
              readOnly={readOnly}
            />
            <ConfigSlider
              label="Match weight"
              value={config.matchWeight ?? 40}
              onChange={(value) => update({ matchWeight: value })}
              readOnly={readOnly}
            />
            <ConfigSlider
              label="Evaluation weight"
              value={config.evaluationWeight ?? 40}
              onChange={(value) => update({ evaluationWeight: value })}
              readOnly={readOnly}
            />
          </>
        )}

        {nodeType === 'interview' && (
          <>
            <ConfigNumberField
              label="Technical questions"
              value={config.technicalQuestions ?? 3}
              onChange={(value) => update({ technicalQuestions: value })}
              readOnly={readOnly}
            />
            <ConfigNumberField
              label="Behavioral questions"
              value={config.behavioralQuestions ?? 2}
              onChange={(value) => update({ behavioralQuestions: value })}
              readOnly={readOnly}
            />
            <ConfigNumberField
              label="Gap probing questions"
              value={config.gapQuestions ?? 2}
              onChange={(value) => update({ gapQuestions: value })}
              readOnly={readOnly}
            />
          </>
        )}
      </Box>
    </Drawer>
  );
}
