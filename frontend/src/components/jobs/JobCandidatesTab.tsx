import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateStatusChip } from '../candidates/CandidateStatusChip';
import { ScoreBadge } from '../candidates/ScoreBadge';
import { useCandidates } from '../../context/CandidatesContext';
import { useThemeMode } from '../../context/ThemeContext';
import type { CandidateSort, CandidateStatusFilter } from '../../types/candidate';
import { IN_PROGRESS_STATUSES } from '../../types/candidate';

type JobCandidatesTabProps = {
  jobId: string;
  onGoToUpload?: () => void;
};

function formatScore(score: number | null) {
  if (score === null) return '—';
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function JobCandidatesTab({ jobId, onGoToUpload }: JobCandidatesTabProps) {
  const { getCandidatesByJob } = useCandidates();
  const { tokens: t } = useThemeMode();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatusFilter>('all');
  const [sortBy, setSortBy] = useState<CandidateSort>('rank');

  const candidates = getCandidatesByJob(jobId);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'in_progress'
          ? IN_PROGRESS_STATUSES.includes(candidate.status) || candidate.status === 'pending'
          : candidate.status === statusFilter);

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'overall') {
        const aScore = a.overallScore ?? -1;
        const bScore = b.overallScore ?? -1;
        return bScore - aScore;
      }
      const aRank = a.rank ?? Number.MAX_SAFE_INTEGER;
      const bRank = b.rank ?? Number.MAX_SAFE_INTEGER;
      return aRank - bRank;
    });
  }, [candidates, search, sortBy, statusFilter]);

  return (
    <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, overflow: 'hidden' }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          borderBottom: `1px solid ${t.borderGold}`,
        }}
      >
        <Box>
          <Typography variant="h6">Candidates</Typography>
          <Typography variant="body2" color="text.secondary">
            {candidates.length} applicant{candidates.length === 1 ? '' : 's'} for this role
          </Typography>
        </Box>
        {onGoToUpload && (
          <Button
            variant="outlined"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={onGoToUpload}
          >
            Upload Resumes
          </Button>
        )}
      </Box>

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
          placeholder="Search by name or email..."
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
          onChange={(e) => setStatusFilter(e.target.value as CandidateStatusFilter)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Done</MenuItem>
          <MenuItem value="in_progress">In progress</MenuItem>
          <MenuItem value="filtered_out">Filtered</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="pending">Queued</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as CandidateSort)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="rank">Rank</MenuItem>
          <MenuItem value="overall">Overall score</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </TextField>
      </Box>

      {filteredCandidates.length === 0 ? (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {candidates.length === 0
              ? 'No candidates yet for this job.'
              : 'No candidates match your filters.'}
          </Typography>
          {candidates.length === 0 && onGoToUpload && (
            <Button
              variant="contained"
              startIcon={<CloudUploadOutlinedIcon />}
              sx={{ mt: 2 }}
              onClick={onGoToUpload}
            >
              Upload resumes
            </Button>
          )}
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={72}>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Match</TableCell>
                <TableCell align="center">Eval</TableCell>
                <TableCell align="center">Overall</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  hover
                  sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {candidate.rank ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {candidate.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {candidate.email} · {candidate.experienceYears} yrs exp
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <ScoreBadge score={candidate.matchScore} />
                  </TableCell>
                  <TableCell align="center">
                    <ScoreBadge score={candidate.evalScore} />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: candidate.overallScore !== null ? 700 : 400,
                        color: candidate.overallScore !== null ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {formatScore(candidate.overallScore)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <CandidateStatusChip status={candidate.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View candidate report">
                      <IconButton
                        size="small"
                        aria-label={`View ${candidate.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/candidates/${candidate.id}`);
                        }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
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
  );
}
