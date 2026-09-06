import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { ScoreBadge } from '../components/candidates/ScoreBadge';
import { StatCard } from '../components/dashboard/StatCard';
import { JobStatusChip } from '../components/jobs/JobStatusChip';
import { mockDashboardStats, mockRecentJobs } from '../data/mockDashboard';
import { useThemeMode } from '../context/ThemeContext';

export function DashboardPage() {
  const { tokens: t } = useThemeMode();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your recruitment pipeline
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/jobs"
          variant="contained"
          startIcon={<WorkOutlineOutlinedIcon />}
        >
          View all jobs
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<WorkOutlineOutlinedIcon />}
            label="Total Jobs"
            value={mockDashboardStats.totalJobs}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<GroupOutlinedIcon />}
            label="Total Candidates"
            value={mockDashboardStats.totalCandidates}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<AssessmentOutlinedIcon />}
            label="Average Score"
            value={mockDashboardStats.avgScore}
            suffix="%"
          />
        </Grid>
      </Grid>

      <Paper
        sx={{
          bgcolor: t.bgPaper,
          boxShadow: t.shadows.card,
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
            borderBottom: `1px solid ${t.borderGold}`,
          }}
        >
          <Typography variant="h6">Recent Jobs</Typography>
          <Button
            component={RouterLink}
            to="/jobs"
            size="small"
            endIcon={<ArrowForwardOutlinedIcon />}
          >
            See all
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Candidates</TableCell>
                <TableCell align="center">Avg Score</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockRecentJobs.map((job) => (
                <TableRow
                  key={job.id}
                  hover
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {job.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <JobStatusChip status={job.status} />
                  </TableCell>
                  <TableCell align="center">{job.candidateCount}</TableCell>
                  <TableCell align="center">
                    <ScoreBadge score={job.avgScore} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={RouterLink}
                      to="/jobs"
                      size="small"
                      aria-label={`View ${job.title}`}
                    >
                      <ArrowForwardOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
