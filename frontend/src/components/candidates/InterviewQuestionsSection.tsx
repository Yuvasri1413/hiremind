import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ReportSectionCard } from './ReportSectionCard';

type InterviewQuestionsSectionProps = {
  technical: string[];
  behavioral: string[];
  gapProbing: string[];
};

type QuestionTab = 'technical' | 'behavioral' | 'gap';

export function InterviewQuestionsSection({
  technical,
  behavioral,
  gapProbing,
}: InterviewQuestionsSectionProps) {
  const [tab, setTab] = useState<QuestionTab>('technical');

  const questions =
    tab === 'technical' ? technical : tab === 'behavioral' ? behavioral : gapProbing;

  return (
    <ReportSectionCard title="Interview Questions">
      <Tabs
        value={tab}
        onChange={(_, value: QuestionTab) => setTab(value)}
        sx={{ mb: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
      >
        <Tab value="technical" label="Technical" />
        <Tab value="behavioral" label="Behavioral" />
        <Tab value="gap" label="Gap Probing" />
      </Tabs>

      <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
        {questions.map((question) => (
          <Typography component="li" variant="body2" key={question} sx={{ mb: 1 }}>
            {question}
          </Typography>
        ))}
      </Box>
    </ReportSectionCard>
  );
}

type RecommendationChipProps = {
  recommendation: 'Shortlist' | 'Hold' | 'Reject';
};

export function RecommendationChip({ recommendation }: RecommendationChipProps) {
  const color =
    recommendation === 'Shortlist'
      ? 'success'
      : recommendation === 'Hold'
        ? 'warning'
        : 'error';

  return <Chip label={recommendation} color={color} size="small" sx={{ fontWeight: 700 }} />;
}
