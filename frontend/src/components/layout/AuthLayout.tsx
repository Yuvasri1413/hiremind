import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useThemeMode } from '../../context/ThemeContext';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { tokens: t } = useThemeMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: t.gradients.pageBackground,
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.3s ease',
      }}
    >
      <ThemeToggle />
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4.5 },
          position: 'relative',
          bgcolor: t.bgPaper,
          border: `1px solid ${t.borderGold}`,
          borderTop: `3px solid ${t.gold}`,
          boxShadow: t.shadows.card,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: t.gradients.cardShine,
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <BrandLogo variant="vertical" size="lg" />

          <Box
            sx={{
              width: 48,
              height: 2,
              bgcolor: 'primary.main',
              borderRadius: 1,
              my: 2,
              opacity: 0.85,
            }}
          />

          <Typography variant="h6" component="h2" color="text.primary">
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75, textAlign: 'center', maxWidth: 320 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
      </Paper>
    </Box>
  );
}
