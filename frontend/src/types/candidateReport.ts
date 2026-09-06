export type PipelineStageKey =
  | 'parse'
  | 'screen'
  | 'match'
  | 'eval'
  | 'rank'
  | 'interview';

export type StageStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'failed';

export type PipelineStage = {
  key: PipelineStageKey;
  label: string;
  status: StageStatus;
};

export type EvaluationRecommendation = 'Shortlist' | 'Hold' | 'Reject';

export type CandidateReport = {
  pipeline: PipelineStage[];
  parsedProfile?: {
    skills: string[];
    education: string;
    experience: string;
  };
  screening?: {
    score: number;
    relevant: boolean;
    summary: string;
  };
  skillMatch?: {
    score: number;
    matched: string[];
    missing: string[];
  };
  evaluation?: {
    score: number;
    recommendation: EvaluationRecommendation;
    strengths: string[];
    weaknesses: string[];
  };
  interviewQuestions?: {
    technical: string[];
    behavioral: string[];
    gapProbing: string[];
  };
};

export const PIPELINE_STAGE_ORDER: PipelineStageKey[] = [
  'parse',
  'screen',
  'match',
  'eval',
  'rank',
  'interview',
];

export const PIPELINE_STAGE_LABELS: Record<PipelineStageKey, string> = {
  parse: 'Parse',
  screen: 'Screen',
  match: 'Match',
  eval: 'Eval',
  rank: 'Rank',
  interview: 'Interview',
};
