import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '../../context/ThemeContext';
import type { PipelineStage, StageStatus } from '../../types/candidateReport';

type PipelineProgressProps = {
  stages: PipelineStage[];
};

function StageIcon({ status }: { status: StageStatus }) {
  if (status === 'completed') {
    return <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />;
  }
  if (status === 'running') {
    return <CircularProgress size={16} color="warning" />;
  }
  if (status === 'failed') {
    return <CloseIcon sx={{ fontSize: 16, color: 'error.main' }} />;
  }
  if (status === 'skipped') {
    return <RemoveIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
  }
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: 'action.disabled',
      }}
    />
  );
}

export function PipelineProgress({ stages }: PipelineProgressProps) {
  const { tokens: t } = useThemeMode();

  return (
    <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, p: 2.5 }}>
      <Typography variant="h6" gutterBottom>
        Pipeline Progress
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {stages.map((stage, index) => (
          <Box key={stage.key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.75,
                borderRadius: 1.5,
                border: `1px solid ${t.borderGold}`,
                bgcolor:
                  stage.status === 'running'
                    ? t.goldMuted
                    : stage.status === 'completed'
                      ? 'rgba(46, 125, 50, 0.12)'
                      : 'transparent',
              }}
            >
              <StageIcon status={stage.status} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {stage.label}
              </Typography>
            </Box>
            {index < stages.length - 1 && (
              <Typography variant="caption" color="text.disabled">
                →
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
