import type { Candidate } from '../../types/candidate';
import type { CandidateReport, EvaluationRecommendation, PipelineStageKey, StageStatus } from '../../types/candidateReport';
import type { Job, JobStatus } from '../../types/job';
import type { JobRequirements } from '../../types/jobRequirements';
import type { Recruiter } from '../../types/auth';
import type { WorkflowGraph } from '../../types/workflow';

type BackendRecruiter = {
  id: string;
  name: string;
  email: string;
};

type BackendJob = {
  id: string;
  title: string;
  description: string;
  location: string;
  min_experience: number;
  max_experience: number;
  status: JobStatus;
  candidate_count: number;
  avg_score: number | null;
  created_at: string;
  requirements?: BackendRequirements | null;
};

type BackendRequirements = {
  required_skills: string[];
  preferred_skills: string[];
  min_experience: string;
  education: string;
  responsibilities: string[];
};

type BackendCandidate = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  experience_years: number;
  status: Candidate['status'];
  rank: number | null;
  match_score: number | null;
  eval_score: number | null;
  overall_score: number | null;
  resume_file_name?: string;
  created_at: string;
};

type BackendWorkflow = {
  nodes: WorkflowGraph['nodes'];
  edges: WorkflowGraph['edges'];
};

type BackendReport = {
  pipeline: Array<{ key: string; label: string; status: string }>;
  parsed_profile?: {
    skills: string[];
    education: string;
    experience: string;
  } | null;
  screening?: {
    score: number;
    relevant: boolean;
    summary: string;
  } | null;
  skill_match?: {
    score: number;
    matched: string[];
    missing: string[];
  } | null;
  evaluation?: {
    score: number;
    recommendation: string;
    strengths: string[];
    weaknesses: string[];
  } | null;
  interview_questions?: {
    technical: string[];
    behavioral: string[];
    gap_probing: string[];
  } | null;
};

export function mapRecruiter(data: BackendRecruiter): Recruiter {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  };
}

export function mapJob(data: BackendJob): Job {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    location: data.location,
    minExperience: data.min_experience,
    maxExperience: data.max_experience,
    status: data.status,
    candidateCount: data.candidate_count,
    avgScore: data.avg_score,
    createdAt: data.created_at.slice(0, 10),
  };
}

export function mapRequirements(data: BackendRequirements): JobRequirements {
  return {
    requiredSkills: data.required_skills,
    preferredSkills: data.preferred_skills,
    minExperience: data.min_experience,
    education: data.education,
    responsibilities: data.responsibilities,
  };
}

export function mapCandidate(data: BackendCandidate): Candidate {
  return {
    id: data.id,
    jobId: data.job_id,
    name: data.name,
    email: data.email,
    experienceYears: data.experience_years,
    status: data.status,
    rank: data.rank,
    matchScore: data.match_score,
    evalScore: data.eval_score,
    overallScore: data.overall_score,
    resumeFileName: data.resume_file_name,
    addedAt: data.created_at.slice(0, 10),
  };
}

export function mapWorkflow(data: BackendWorkflow): WorkflowGraph {
  return {
    nodes: data.nodes,
    edges: data.edges,
  };
}

export function mapCandidateReport(data: BackendReport): CandidateReport {
  return {
    pipeline: data.pipeline.map((stage) => ({
      key: stage.key as PipelineStageKey,
      label: stage.label,
      status: stage.status as StageStatus,
    })),
    parsedProfile: data.parsed_profile ?? undefined,
    screening: data.screening ?? undefined,
    skillMatch: data.skill_match
      ? {
          score: data.skill_match.score,
          matched: data.skill_match.matched,
          missing: data.skill_match.missing,
        }
      : undefined,
    evaluation: data.evaluation
      ? {
          score: data.evaluation.score,
          recommendation: data.evaluation.recommendation as EvaluationRecommendation,
          strengths: data.evaluation.strengths,
          weaknesses: data.evaluation.weaknesses,
        }
      : undefined,
    interviewQuestions: data.interview_questions
      ? {
          technical: data.interview_questions.technical,
          behavioral: data.interview_questions.behavioral,
          gapProbing: data.interview_questions.gap_probing,
        }
      : undefined,
  };
}

export function toJobCreatePayload(values: {
  title: string;
  description: string;
  location: string;
  minExperience: number | '';
  maxExperience: number | '';
  status: JobStatus;
}) {
  return {
    title: values.title,
    description: values.description,
    location: values.location,
    min_experience: values.minExperience === '' ? 0 : values.minExperience,
    max_experience: values.maxExperience === '' ? 0 : values.maxExperience,
    status: values.status,
  };
}

export type {
  BackendCandidate,
  BackendJob,
  BackendReport,
  BackendRequirements,
  BackendWorkflow,
};
