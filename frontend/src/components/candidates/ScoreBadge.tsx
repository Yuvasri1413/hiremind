import ScoreOutlinedIcon from '@mui/icons-material/ScoreOutlined';
import Chip from '@mui/material/Chip';

type ScoreBadgeProps = {
  score: number | null;
  size?: 'small' | 'medium';
};

function getScoreColor(score: number): 'success' | 'warning' | 'error' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

export function ScoreBadge({ score, size = 'small' }: ScoreBadgeProps) {
  if (score === null) {
    return <Chip label="—" size={size} variant="outlined" />;
  }

  return (
    <Chip
      icon={<ScoreOutlinedIcon />}
      label={score}
      color={getScoreColor(score)}
      size={size}
      variant="outlined"
    />
  );
}
