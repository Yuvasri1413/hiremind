import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../api';
import type { DashboardStats, Job, JobFormValues } from '../types/job';

type JobsContextValue = {
  jobs: Job[];
  loading: boolean;
  addJob: (values: JobFormValues) => Promise<Job>;
  updateJob: (id: string, values: JobFormValues) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJob: (id: string) => Job | undefined;
  stats: DashboardStats;
  refresh: () => Promise<void>;
};

const JobsContext = createContext<JobsContextValue | null>(null);

type JobsProviderProps = {
  children: ReactNode;
};

export function JobsProvider({ children }: JobsProviderProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalCandidates: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [nextJobs, nextStats] = await Promise.all([api.jobs.list(), api.jobs.getStats()]);
    setJobs(nextJobs);
    setStats(nextStats);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const addJob = useCallback(
    async (values: JobFormValues) => {
      const newJob = await api.jobs.create(values);
      await refresh();
      return newJob;
    },
    [refresh],
  );

  const updateJob = useCallback(
    async (id: string, values: JobFormValues) => {
      await api.jobs.update(id, values);
      await refresh();
    },
    [refresh],
  );

  const deleteJob = useCallback(
    async (id: string) => {
      await api.jobs.delete(id);
      await refresh();
    },
    [refresh],
  );

  const getJob = useCallback(
    (id: string) => jobs.find((job) => job.id === id),
    [jobs],
  );

  const value = useMemo(
    () => ({ jobs, loading, addJob, updateJob, deleteJob, getJob, stats, refresh }),
    [jobs, loading, addJob, updateJob, deleteJob, getJob, stats, refresh],
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within JobsProvider');
  }
  return context;
}
