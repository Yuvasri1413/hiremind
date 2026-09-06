import type { JobStatus } from '../../types/job';
import Chip from '@mui/material/Chip';

const statusConfig: Record<
  JobStatus,
  { label: string; color: 'default' | 'success' | 'error' }
> = {
  draft: { label: 'Draft', color: 'default' },
  open: { label: 'Open', color: 'success' },
  closed: { label: 'Closed', color: 'error' },
};

type JobStatusChipProps = {
  status: JobStatus;
  size?: 'small' | 'medium';
};

export function JobStatusChip({ status, size = 'small' }: JobStatusChipProps) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size={size} />;
}
