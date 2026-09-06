import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import type { CandidateStatus } from '../../types/candidate';
import { IN_PROGRESS_STATUSES } from '../../types/candidate';

const statusConfig: Record<
  CandidateStatus,
  { label: string; color: 'default' | 'success' | 'warning' | 'error' }
> = {
  pending: { label: 'Queued', color: 'default' },
  parsing: { label: 'Parsing', color: 'warning' },
  screening: { label: 'Screening', color: 'warning' },
  skill_match: { label: 'Matching', color: 'warning' },
  evaluating: { label: 'Evaluating', color: 'warning' },
  ranked: { label: 'Ranking', color: 'warning' },
  completed: { label: 'Done', color: 'success' },
  filtered_out: { label: 'Filtered', color: 'default' },
  failed: { label: 'Failed', color: 'error' },
};

type CandidateStatusChipProps = {
  status: CandidateStatus;
  size?: 'small' | 'medium';
};

export function CandidateStatusChip({ status, size = 'small' }: CandidateStatusChipProps) {
  const config = statusConfig[status];
  const inProgress = IN_PROGRESS_STATUSES.includes(status) || status === 'pending';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      {inProgress && status !== 'pending' && (
        <CircularProgress size={14} color="warning" />
      )}
      <Chip label={config.label} color={config.color} size={size} />
    </Box>
  );
}
