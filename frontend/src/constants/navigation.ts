import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

export const DRAWER_WIDTH = 240;

export type NavItem = {
  label: string;
  path: string;
  icon: typeof DashboardOutlinedIcon;
};

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon },
  { label: 'Jobs', path: '/jobs', icon: WorkOutlineOutlinedIcon },
];
