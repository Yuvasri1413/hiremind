import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '../../context/ThemeContext';

type ReportSectionCardProps = {
  title: string;
  score?: number | null;
  children: ReactNode;
};

export function ReportSectionCard({ title, score, children }: ReportSectionCardProps) {
  const { tokens: t } = useThemeMode();

  return (
    <Paper
      sx={{
        bgcolor: t.bgPaper,
        boxShadow: t.shadows.card,
        borderTop: `3px solid ${t.gold}`,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: `1px solid ${t.borderGold}`,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {score !== undefined && score !== null && (
          <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
            Score: {Number.isInteger(score) ? score : score.toFixed(1)}
          </Typography>
        )}
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
}
