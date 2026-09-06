import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JobFormDialog } from '../components/jobs/JobFormDialog';
import { JobStatusChip } from '../components/jobs/JobStatusChip';
import { useJobs } from '../context/JobsContext';
import { useThemeMode } from '../context/ThemeContext';
import type { JobStatus } from '../types/job';
import { formatJobDate } from '../utils/date';

type StatusFilter = JobStatus | 'all';

type DialogState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; jobId: string };

export function JobsPage() {
  const { jobs, deleteJob } = useJobs();
  const { tokens: t } = useThemeMode();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  useEffect(() => {
    const state = location.state as { openCreate?: boolean } | null;
    if (state?.openCreate) {
      setDialog({ open: true, mode: 'create' });
      navigate('/jobs', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, statusFilter]);

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
            Jobs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your job openings and recruitment workflows
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ open: true, mode: 'create' })}
        >
          Create Job
        </Button>
      </Box>

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
            flexWrap: 'wrap',
            gap: 2,
            borderBottom: `1px solid ${t.borderGold}`,
          }}
        >
          <TextField
            size="small"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 220, flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
        </Box>

        {filteredJobs.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {jobs.length === 0 ? 'No jobs yet.' : 'No jobs match your filters.'}
            </Typography>
            {jobs.length === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={() => setDialog({ open: true, mode: 'create' })}
              >
                Create your first job
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Candidates</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} hover sx={{ '&:last-child td': { border: 0 } }}>
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
                    <TableCell>{formatJobDate(job.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View job">
                        <IconButton
                          size="small"
                          aria-label={`View ${job.title}`}
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit job">
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={`Edit ${job.title}`}
                          onClick={() =>
                            setDialog({ open: true, mode: 'edit', jobId: job.id })
                          }
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete job">
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Delete ${job.title}`}
                          onClick={() => deleteJob(job.id)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <JobFormDialog
        open={dialog.open}
        mode={dialog.open ? dialog.mode : 'create'}
        jobId={dialog.open && dialog.mode === 'edit' ? dialog.jobId : undefined}
        onClose={() => setDialog({ open: false })}
      />
    </Box>
  );
}
