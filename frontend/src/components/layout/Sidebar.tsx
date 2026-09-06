import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH, navItems } from '../../constants/navigation';
import { useThemeMode } from '../../context/ThemeContext';

export function Sidebar() {
  const location = useLocation();
  const { tokens: t } = useThemeMode();

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
        pt: 2,
      }}
    >
      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;

          return (
            <ListItemButton
              key={path}
              component={NavLink}
              to={path}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: t.goldMuted,
                  borderLeft: `3px solid ${t.gold}`,
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  bgcolor: t.goldMuted,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
