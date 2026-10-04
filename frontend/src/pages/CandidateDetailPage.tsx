import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { API_BASE_URL } from '../api/config';
import { getToken } from '../api/live/tokenStorage';
import {
  InterviewQuestionsSection,
  RecommendationChip,
} from '../components/candidates/InterviewQuestionsSection';
import { PipelineProgress } from '../components/candidates/PipelineProgress';
import { ReportSectionCard } from '../components/candidates/ReportSectionCard';
import { CandidateStatusChip } from '../components/candidates/CandidateStatusChip';
import { useCandidates } from '../context/CandidatesContext';
import { useThemeMode } from '../context/ThemeContext';
import type { CandidateReport } from '../types/candidateReport';

function formatScore(score: number | null) {
  if (score === null) return null;
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { getCandidate, loading: candidatesLoading } = useCandidates();
  const { tokens: t } = useThemeMode();
  const [report, setReport] = useState<CandidateReport | null>(null);

  const candidate = candidateId ? getCandidate(candidateId) : undefined;

  useEffect(() => {
    if (!candidate) return;
    api.candidateReports.getByCandidate(candidate).then(setReport);
  }, [candidate]);

  if (candidatesLoading) return null;
  if (!candidate) return <Navigate to="/jobs" replace />;

  const activeCandidate = candidate;

  const hasReportContent =
    report &&
    (report.parsedProfile ||
      report.screening ||
      report.skillMatch ||
      report.evaluation ||
      report.interviewQuestions);

  async function downloadResume() {
    if (!candidateId) return;
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/resume`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Could not download resume');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = activeCandidate.resumeFileName || 'resume.pdf';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function exportInterviewQuestions() {
    if (!report?.interviewQuestions) return;
    const { technical, behavioral, gapProbing } = report.interviewQuestions;
    const lines = [
      `Interview questions — ${activeCandidate.name}`,
      '',
      'Technical',
      ...technical.map((q, i) => `${i + 1}. ${q}`),
      '',
      'Behavioral',
      ...behavioral.map((q, i) => `${i + 1}. ${q}`),
      '',
      'Gap probing',
      ...gapProbing.map((q, i) => `${i + 1}. ${q}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${activeCandidate.name.replace(/\s+/g, '_')}_interview_questions.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box>
      <Button
        component={RouterLink}
        to={`/jobs/${candidate.jobId}`}
        state={{ tab: 'candidates' }}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Candidates
      </Button>

      <Paper
        sx={{
          bgcolor: t.bgPaper,
          boxShadow: t.shadows.card,
          p: 3,
          mb: 3,
        }}
      >
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
              {candidate.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {candidate.email} · {candidate.experienceYears} yrs experience
            </Typography>
            {candidate.resumeFileName && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Resume: {candidate.resumeFileName}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            {candidate.rank !== null && (
              <Chip label={`Rank #${candidate.rank}`} color="primary" variant="outlined" />
            )}
            {candidate.overallScore !== null && (
              <Chip
                label={`Score: ${formatScore(candidate.overallScore)}`}
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            )}
            <CandidateStatusChip status={candidate.status} size="medium" />
            {candidate.resumeFileName && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadOutlinedIcon />}
                onClick={() => void downloadResume().catch(() => undefined)}
              >
                Resume
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {candidate.parseError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Resume parse note: {candidate.parseError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <PipelineProgress stages={report?.pipeline ?? []} />

        {!report && (
          <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Loading AI report…
            </Typography>
          </Paper>
        )}

        {report && !hasReportContent && (
          <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              AI report is still being generated. Check back once parsing completes.
            </Typography>
          </Paper>
        )}

        {report?.parsedProfile && (
          <ReportSectionCard title="Parsed Profile">
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {report.parsedProfile.skills.map((skill) => (
                <Chip key={skill} label={skill} size="small" color="primary" />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Education: {report.parsedProfile.education} · Experience:{' '}
              {report.parsedProfile.experience}
            </Typography>
          </ReportSectionCard>
        )}

        {report?.screening && (
          <ReportSectionCard title="Screening" score={report.screening.score}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Relevant:
              </Typography>
              <Chip
                label={report.screening.relevant ? 'Yes' : 'No'}
                size="small"
                color={report.screening.relevant ? 'success' : 'default'}
              />
            </Box>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              &ldquo;{report.screening.summary}&rdquo;
            </Typography>
          </ReportSectionCard>
        )}

        {report?.skillMatch && (
          <ReportSectionCard title="Skill Match" score={report.skillMatch.score}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Matched
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {report.skillMatch.matched.join(', ')}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Missing
            </Typography>
            <Typography variant="body2">
              {report.skillMatch.missing.join(', ')}
            </Typography>
          </ReportSectionCard>
        )}

        {report?.evaluation && (
          <ReportSectionCard title="Evaluation" score={report.evaluation.score}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Recommendation:
              </Typography>
              <RecommendationChip recommendation={report.evaluation.recommendation} />
            </Box>
            <Divider sx={{ borderColor: t.borderGold, mb: 2 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Strengths
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {report.evaluation.strengths.map((item) => (
                    <Typography component="li" variant="body2" key={item} sx={{ mb: 0.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Weaknesses
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {report.evaluation.weaknesses.map((item) => (
                    <Typography component="li" variant="body2" key={item} sx={{ mb: 0.5 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          </ReportSectionCard>
        )}

        {report?.interviewQuestions && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button size="small" variant="outlined" onClick={exportInterviewQuestions}>
                Export questions (.txt)
              </Button>
            </Box>
            <InterviewQuestionsSection
              technical={report.interviewQuestions.technical}
              behavioral={report.interviewQuestions.behavioral}
              gapProbing={report.interviewQuestions.gapProbing}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
