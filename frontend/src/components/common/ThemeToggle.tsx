import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useThemeMode } from '../../context/ThemeContext';

type ThemeToggleProps = {
  /** When true, renders inline (e.g. in AppBar) instead of fixed position */
  embedded?: boolean;
};

export function ThemeToggle({ embedded = false }: ThemeToggleProps) {
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';

  const button = (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        size="medium"
      >
        {isDark ? (
          <LightModeOutlinedIcon sx={{ color: 'primary.main' }} />
        ) : (
          <DarkModeOutlinedIcon sx={{ color: 'primary.dark' }} />
        )}
      </IconButton>
    </Tooltip>
  );

  if (embedded) return button;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1300,
      }}
    >
      {button}
    </Box>
  );
}
