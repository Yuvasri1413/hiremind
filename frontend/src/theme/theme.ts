import { createTheme, type Theme } from '@mui/material/styles';
import type { ThemeMode } from './tokens';
import { getThemeTokens } from './tokens';

export function createAppTheme(mode: ThemeMode): Theme {
  const t = getThemeTokens(mode);
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.gold,
        light: t.goldLight,
        dark: t.goldDark,
        contrastText: '#0A0A0A',
      },
      secondary: {
        main: isDark ? '#252525' : '#E8E4DA',
        contrastText: t.textPrimary,
      },
      success: { main: '#4CAF50' },
      warning: { main: t.gold },
      error: { main: '#EF5350' },
      background: {
        default: t.bgDefault,
        paper: t.bgPaper,
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textSecondary,
      },
      divider: t.borderGold,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontFamily: '"Playfair Display", "Georgia", serif',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
      h5: {
        fontFamily: '"Playfair Display", "Georgia", serif',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
      h6: {
        fontFamily: '"Playfair Display", "Georgia", serif',
        fontWeight: 500,
        letterSpacing: '0.01em',
      },
      subtitle1: { fontWeight: 500, letterSpacing: '0.01em' },
      button: { fontWeight: 600, letterSpacing: '0.04em' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowX: 'hidden',
          },
          body: {
            backgroundColor: t.bgDefault,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowX: 'hidden',
          },
          '*::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
            fontWeight: 600,
            transition: 'all 0.25s ease',
            '&.MuiButton-containedPrimary': {
              background: `linear-gradient(135deg, ${t.goldLight} 0%, ${t.gold} 50%, ${t.goldDark} 100%)`,
              color: '#0A0A0A',
              boxShadow: isDark
                ? '0 4px 20px rgba(245, 197, 24, 0.25)'
                : '0 4px 16px rgba(201, 160, 0, 0.2)',
              '&:hover': {
                background: `linear-gradient(135deg, ${t.goldLight} 0%, ${t.goldDark} 100%)`,
                boxShadow: isDark
                  ? '0 6px 28px rgba(245, 197, 24, 0.35)'
                  : '0 6px 24px rgba(201, 160, 0, 0.28)',
                transform: 'translateY(-1px)',
              },
            },
            '&.MuiButton-outlinedPrimary': {
              borderColor: t.borderGold,
              color: isDark ? t.gold : t.goldDark,
              '&:hover': {
                borderColor: t.gold,
                backgroundColor: t.goldMuted,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${t.borderGold}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: t.inputBorder },
              '&:hover fieldset': { borderColor: t.inputBorderHover },
              '&.Mui-focused fieldset': { borderColor: t.gold },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: t.gold },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: isDark ? t.gold : t.goldDark,
            fontWeight: 500,
            '&:hover': { color: t.gold },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            '&.MuiAlert-standardError': {
              backgroundColor: isDark
                ? 'rgba(239, 83, 80, 0.12)'
                : 'rgba(239, 83, 80, 0.08)',
              border: '1px solid rgba(239, 83, 80, 0.3)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&.theme-toggle': {
              border: `1px solid ${t.borderGold}`,
              backgroundColor: isDark
                ? 'rgba(20, 20, 20, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: t.goldMuted,
                borderColor: t.gold,
              },
            },
          },
        },
      },
    },
  });
}
