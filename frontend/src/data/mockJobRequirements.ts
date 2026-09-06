import type { Job } from '../types/job';
import type { JobRequirements } from '../types/jobRequirements';

const presets: Record<string, JobRequirements> = {
  '1': {
    requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'REST APIs'],
    preferredSkills: ['Docker', 'AWS', 'Redis'],
    minExperience: '2+ years',
    education: 'B.Tech / MCA',
    responsibilities: [
      'Design and build scalable backend APIs',
      'Collaborate with frontend and DevOps teams',
      'Write clean, tested, maintainable Python code',
      'Optimize database queries and API performance',
    ],
  },
  '2': {
    requiredSkills: ['React', 'TypeScript', 'HTML/CSS', 'Material UI'],
    preferredSkills: ['Vite', 'React Router', 'Testing Library'],
    minExperience: '1+ years',
    education: 'B.Tech / BCA / MCA',
    responsibilities: [
      'Build responsive recruiter-facing UI components',
      'Integrate with REST APIs and manage client state',
      'Maintain design system consistency',
      'Participate in code reviews and sprint planning',
    ],
  },
};

const defaultResponsibilities = [
  'Contribute to day-to-day delivery of the role',
  'Collaborate with cross-functional teams',
  'Follow best practices for quality and documentation',
];

export function getMockJobRequirements(job: Job): JobRequirements {
  if (presets[job.id]) return presets[job.id];

  const exp =
    job.minExperience === job.maxExperience
      ? `${job.minExperience} years`
      : `${job.minExperience}–${job.maxExperience} years`;

  return {
    requiredSkills: ['Communication', 'Problem solving', 'Team collaboration'],
    preferredSkills: ['Agile', 'Documentation'],
    minExperience: `${exp} experience`,
    education: 'Relevant degree or equivalent experience',
    responsibilities: defaultResponsibilities,
  };
}
