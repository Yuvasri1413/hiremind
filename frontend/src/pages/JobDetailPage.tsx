import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type ReactNode } from 'react';
import { Link as RouterLink, Navigate, useLocation, useParams } from 'react-router-dom';
import { api } from '../api';
import { JobStatusChip } from '../components/jobs/JobStatusChip';
import { JobCandidatesTab } from '../components/jobs/JobCandidatesTab';
import { JobUploadTab } from '../components/jobs/JobUploadTab';
import { JobWorkflowTab } from '../components/jobs/JobWorkflowTab';
import { useJobs } from '../context/JobsContext';
import { useThemeMode } from '../context/ThemeContext';
import type { JobRequirements } from '../types/jobRequirements';

type TabKey = 'overview' | 'workflow' | 'candidates' | 'upload';

const tabLabels: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'workflow', label: 'Workflow' },
  { key: 'candidates', label: 'Candidates' },
  { key: 'upload', label: 'Upload' },
];

function formatExperience(min: number, max: number) {
  if (min === 0 && max === 0) return 'Experience not specified';
  if (min === max) return `${min} yrs experience`;
  return `${min}–${max} yrs experience`;
}

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const { getJob, loading: jobsLoading } = useJobs();
  const { tokens: t } = useThemeMode();
  const [requirements, setRequirements] = useState<JobRequirements | null>(null);
  const [tab, setTab] = useState<TabKey>(() => {
    const state = location.state as { tab?: TabKey } | null;
    return state?.tab ?? 'overview';
  });

  const job = jobId ? getJob(jobId) : undefined;

  useEffect(() => {
    if (!job) return;
    api.requirements.getByJob(job).then(setRequirements);
  }, [job]);

  if (jobsLoading) return null;
  if (!job) return <Navigate to="/jobs" replace />;

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/jobs"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>

      <Paper
        sx={{
          bgcolor: t.bgPaper,
          boxShadow: t.shadows.card,
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {job.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {job.location} · {formatExperience(job.minExperience, job.maxExperience)}
              </Typography>
            </Box>
            <JobStatusChip status={job.status} size="medium" />
          </Box>
        </Box>

        <Divider sx={{ borderColor: t.borderGold }} />

        <Tabs
          value={tab}
          onChange={(_, value: TabKey) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            borderBottom: `1px solid ${t.borderGold}`,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
          }}
        >
          {tabLabels.map(({ key, label }) => (
            <Tab key={key} value={key} label={label} />
          ))}
        </Tabs>
      </Paper>

      {tab === 'overview' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {job.description}
            </Typography>
          </Paper>

          <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Extracted Requirements
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              AI-extracted from the job description
            </Typography>

            {requirements ? (
              <>
            <RequirementRow label="Required Skills">
              {requirements.requiredSkills.map((skill) => (
                <Chip key={skill} label={skill} size="small" color="primary" />
              ))}
            </RequirementRow>

            <RequirementRow label="Preferred Skills">
              {requirements.preferredSkills.map((skill) => (
                <Chip key={skill} label={skill} size="small" variant="outlined" />
              ))}
            </RequirementRow>

            <RequirementRow label="Experience">
              <Typography variant="body2">{requirements.minExperience}</Typography>
            </RequirementRow>

            <RequirementRow label="Education">
              <Typography variant="body2">{requirements.education}</Typography>
            </RequirementRow>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Key Responsibilities
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {requirements.responsibilities.map((item) => (
                  <Typography component="li" variant="body2" key={item} sx={{ mb: 0.5 }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading requirements…
              </Typography>
            )}
          </Paper>
        </Box>
      )}

      {tab === 'upload' && <JobUploadTab jobId={job.id} />}

      {tab === 'candidates' && (
        <JobCandidatesTab jobId={job.id} onGoToUpload={() => setTab('upload')} />
      )}

      {tab === 'workflow' && <JobWorkflowTab jobId={job.id} />}
    </Box>
  );
}

type RequirementRowProps = {
  label: string;
  children: ReactNode;
};

function RequirementRow({ label, children }: RequirementRowProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{children}</Box>
    </Box>
  );
}
