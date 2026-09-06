import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '../../context/ThemeContext';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
};

export function StatCard({ icon, label, value, suffix }: StatCardProps) {
  const { mode, tokens: t } = useThemeMode();

  return (
    <Paper
      sx={{
        p: 2.5,
        height: '100%',
        bgcolor: t.bgPaper,
        borderTop: `3px solid ${t.gold}`,
        boxShadow: t.shadows.card,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow:
            mode === 'dark'
              ? '0 8px 32px rgba(245, 197, 24, 0.12)'
              : '0 8px 24px rgba(10, 10, 10, 0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: t.goldMuted,
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {value}
            {suffix && (
              <Typography
                component="span"
                variant="h6"
                sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 500 }}
              >
                {suffix}
              </Typography>
            )}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
