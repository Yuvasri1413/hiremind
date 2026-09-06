import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useThemeMode } from '../context/ThemeContext';

/** Placeholder — full Jobs list comes in Module 4 */
export function JobsPlaceholderPage() {
  const { tokens: t } = useThemeMode();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your job openings and recruitment workflows
      </Typography>

      <Paper
        sx={{
          p: 5,
          textAlign: 'center',
          bgcolor: t.bgPaper,
          boxShadow: t.shadows.card,
          borderTop: `3px solid ${t.gold}`,
        }}
      >
        <WorkOutlineOutlinedIcon
          sx={{ fontSize: 48, color: 'primary.main', mb: 2, opacity: 0.8 }}
        />
        <Typography variant="h6" gutterBottom>
          Jobs module coming next
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          Module 4 will add the full jobs list, create job form, and job detail pages.
        </Typography>
        <Button variant="outlined" color="primary" disabled>
          Create Job
        </Button>
      </Paper>
    </Box>
  );
}
