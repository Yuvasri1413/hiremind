import type { Candidate } from '../types/candidate';
import type { CandidateReport, PipelineStage, StageStatus } from '../types/candidateReport';
import {
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGE_ORDER,
  type PipelineStageKey,
} from '../types/candidateReport';

const fullReports: Record<string, CandidateReport> = {
  c1: {
    pipeline: buildPipeline({
      parse: 'completed',
      screen: 'completed',
      match: 'completed',
      eval: 'completed',
      rank: 'completed',
      interview: 'completed',
    }),
    parsedProfile: {
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'REST APIs', 'Git'],
      education: 'MCA',
      experience: '3 years',
    },
    screening: {
      score: 82,
      relevant: true,
      summary:
        'Strong Python backend experience matches role requirements. Prior API development aligns well with the job description.',
    },
    skillMatch: {
      score: 88,
      matched: ['Python', 'FastAPI', 'PostgreSQL'],
      missing: ['Docker (preferred)', 'AWS (preferred)'],
    },
    evaluation: {
      score: 85,
      recommendation: 'Shortlist',
      strengths: [
        'Solid backend fundamentals with production API experience',
        'Good overlap with required stack (Python, FastAPI, PostgreSQL)',
        'Clear progression across 3 years of relevant work',
      ],
      weaknesses: [
        'Limited exposure to containerization and cloud deployment',
        'No mention of large-scale system design projects',
      ],
    },
    interviewQuestions: {
      technical: [
        'Explain FastAPI dependency injection and when you would use it.',
        'How do you design RESTful APIs for versioning and backward compatibility?',
        'Describe how you optimize PostgreSQL queries for high-traffic endpoints.',
      ],
      behavioral: [
        'Tell us about a time you resolved a production incident under time pressure.',
        'How do you collaborate with frontend teams on API contracts?',
      ],
      gapProbing: [
        'What steps have you taken to learn Docker or cloud deployment?',
        'Describe a project where you owned end-to-end backend delivery.',
      ],
    },
  },
  c2: {
    pipeline: buildPipeline({
      parse: 'completed',
      screen: 'completed',
      match: 'completed',
      eval: 'completed',
      rank: 'completed',
      interview: 'completed',
    }),
    parsedProfile: {
      skills: ['Python', 'Django', 'SQL', 'Redis', 'Linux'],
      education: 'B.Tech CSE',
      experience: '4 years',
    },
    screening: {
      score: 78,
      relevant: true,
      summary:
        'Relevant backend background with Python experience. Slightly less FastAPI-specific depth than top candidates.',
    },
    skillMatch: {
      score: 82,
      matched: ['Python', 'PostgreSQL', 'REST APIs'],
      missing: ['FastAPI (required)', 'Docker (preferred)'],
    },
    evaluation: {
      score: 80,
      recommendation: 'Shortlist',
      strengths: [
        'Strong general Python backend experience',
        'Good database and caching knowledge',
      ],
      weaknesses: [
        'Primary framework experience is Django rather than FastAPI',
        'Preferred DevOps skills not evident on resume',
      ],
    },
    interviewQuestions: {
      technical: [
        'How would you migrate a Django REST service to FastAPI?',
        'Explain your approach to database indexing and query tuning.',
      ],
      behavioral: [
        'Describe a challenging cross-team integration you led.',
      ],
      gapProbing: [
        'Have you built or contributed to FastAPI services before?',
      ],
    },
  },
  c3: {
    pipeline: buildPipeline({
      parse: 'completed',
      screen: 'failed',
      match: 'skipped',
      eval: 'skipped',
      rank: 'skipped',
      interview: 'skipped',
    }),
    parsedProfile: {
      skills: ['JavaScript', 'HTML', 'CSS', 'Basic SQL'],
      education: 'BCA',
      experience: '1 year',
    },
    screening: {
      score: 45,
      relevant: false,
      summary:
        'Profile is primarily frontend-focused with limited backend experience. Does not meet minimum Python backend requirements for this role.',
    },
    skillMatch: {
      score: 45,
      matched: ['Basic SQL'],
      missing: ['Python', 'FastAPI', 'PostgreSQL', 'REST APIs'],
    },
  },
  c5: {
    pipeline: buildPipeline({
      parse: 'completed',
      screen: 'completed',
      match: 'completed',
      eval: 'completed',
      rank: 'completed',
      interview: 'completed',
    }),
    parsedProfile: {
      skills: ['React', 'TypeScript', 'Material UI', 'Vite', 'CSS'],
      education: 'MCA',
      experience: '2 years',
    },
    screening: {
      score: 90,
      relevant: true,
      summary:
        'Excellent fit for frontend role with modern React stack and component-driven development experience.',
    },
    skillMatch: {
      score: 91,
      matched: ['React', 'TypeScript', 'Material UI'],
      missing: ['Testing Library (preferred)'],
    },
    evaluation: {
      score: 88,
      recommendation: 'Shortlist',
      strengths: [
        'Strong React and TypeScript fundamentals',
        'Experience building polished UI with design systems',
      ],
      weaknesses: ['Limited end-to-end testing examples on resume'],
    },
    interviewQuestions: {
      technical: [
        'How do you structure state in a large React application?',
        'Explain your approach to responsive layouts with MUI.',
      ],
      behavioral: ['Tell us about improving UX based on user feedback.'],
      gapProbing: ['What testing strategies do you use for React components?'],
    },
  },
};

function buildPipeline(statuses: Record<PipelineStageKey, StageStatus>): PipelineStage[] {
  return PIPELINE_STAGE_ORDER.map((key) => ({
    key,
    label: PIPELINE_STAGE_LABELS[key],
    status: statuses[key],
  }));
}

function pipelineForStatus(status: Candidate['status']): PipelineStage[] {
  const base: Record<PipelineStageKey, StageStatus> = {
    parse: 'pending',
    screen: 'pending',
    match: 'pending',
    eval: 'pending',
    rank: 'pending',
    interview: 'pending',
  };

  if (status === 'pending') return buildPipeline(base);

  if (status === 'parsing') {
    return buildPipeline({ ...base, parse: 'running' });
  }

  if (status === 'screening') {
    return buildPipeline({ ...base, parse: 'completed', screen: 'running' });
  }

  if (status === 'skill_match') {
    return buildPipeline({
      ...base,
      parse: 'completed',
      screen: 'completed',
      match: 'running',
    });
  }

  if (status === 'evaluating') {
    return buildPipeline({
      ...base,
      parse: 'completed',
      screen: 'completed',
      match: 'completed',
      eval: 'running',
    });
  }

  if (status === 'ranked') {
    return buildPipeline({
      ...base,
      parse: 'completed',
      screen: 'completed',
      match: 'completed',
      eval: 'completed',
      rank: 'running',
    });
  }

  if (status === 'filtered_out') {
    return buildPipeline({
      parse: 'completed',
      screen: 'failed',
      match: 'skipped',
      eval: 'skipped',
      rank: 'skipped',
      interview: 'skipped',
    });
  }

  if (status === 'failed') {
    return buildPipeline({
      ...base,
      parse: 'completed',
      screen: 'completed',
      match: 'failed',
      eval: 'skipped',
      rank: 'skipped',
      interview: 'skipped',
    });
  }

  return buildPipeline({
    parse: 'completed',
    screen: 'completed',
    match: 'completed',
    eval: 'completed',
    rank: 'completed',
    interview: 'completed',
  });
}

export function getMockCandidateReport(candidate: Candidate): CandidateReport {
  const preset = fullReports[candidate.id];
  if (preset) return preset;

  if (candidate.status === 'completed') {
    return {
      pipeline: pipelineForStatus(candidate.status),
      parsedProfile: {
        skills: ['Communication', 'Problem solving', 'Teamwork'],
        education: 'Relevant degree',
        experience: `${candidate.experienceYears} years`,
      },
      screening: {
        score: candidate.matchScore ?? 70,
        relevant: true,
        summary: 'Candidate profile reviewed and deemed relevant for the role.',
      },
      skillMatch: {
        score: candidate.matchScore ?? 70,
        matched: ['Core skills from resume'],
        missing: ['Some preferred skills'],
      },
      evaluation: {
        score: candidate.evalScore ?? 70,
        recommendation: 'Hold',
        strengths: ['Meets baseline requirements'],
        weaknesses: ['Limited standout differentiators in resume'],
      },
      interviewQuestions: {
        technical: ['Walk us through your most relevant project.'],
        behavioral: ['Describe how you handle tight deadlines.'],
        gapProbing: ['What skills are you actively improving right now?'],
      },
    };
  }

  if (candidate.status === 'parsing') {
    return {
      pipeline: pipelineForStatus(candidate.status),
    };
  }

  if (candidate.status === 'screening') {
    return {
      pipeline: pipelineForStatus(candidate.status),
      parsedProfile: {
        skills: ['React', 'JavaScript', 'HTML', 'CSS'],
        education: 'BCA',
        experience: `${candidate.experienceYears} year`,
      },
    };
  }

  if (candidate.status === 'filtered_out') {
    return {
      pipeline: pipelineForStatus(candidate.status),
      parsedProfile: {
        skills: ['General skills from resume'],
        education: 'Relevant degree',
        experience: `${candidate.experienceYears} years`,
      },
      screening: {
        score: candidate.matchScore ?? 40,
        relevant: false,
        summary: 'Candidate did not pass screening threshold for this role.',
      },
    };
  }

  return {
    pipeline: pipelineForStatus(candidate.status),
  };
}
