import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DRAWER_WIDTH } from '../../constants/navigation';
import { useThemeMode } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { Sidebar } from './Sidebar';
import { UserMenu } from './UserMenu';

const APP_BAR_HEIGHT = 64;

export function AppLayout() {
  const theme = useTheme();
  const { tokens: t } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerPaperSx = {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box' as const,
    top: APP_BAR_HEIGHT,
    height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
    border: 'none',
    borderRight: `1px solid ${t.borderGold}`,
    bgcolor: t.bgPaper,
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* Full-width navbar — border spans entire screen */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: '100%',
          bgcolor: t.bgPaper,
          borderBottom: `1px solid ${t.borderGold}`,
          backgroundImage: 'none',
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: APP_BAR_HEIGHT, px: { xs: 2, sm: 3 } }}>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              sx={{ color: 'text.primary', ml: -0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <BrandLogo size="sm" linkToHome />

          <Box sx={{ flexGrow: 1 }} />

          <ThemeToggle embedded />
          <UserMenu />
        </Toolbar>
      </AppBar>

      {/* Sidebar — below navbar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="Main navigation"
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': drawerPaperSx }}
          >
            <Sidebar />
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ '& .MuiDrawer-paper': drawerPaperSx }}
            open
          >
            <Sidebar />
          </Drawer>
        )}
      </Box>

      {/* Main content — below navbar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: `${APP_BAR_HEIGHT}px`,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          background: t.gradients.pageBackground,
          minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
