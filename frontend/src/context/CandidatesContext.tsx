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
import type { Candidate } from '../types/candidate';

type CandidatesContextValue = {
  candidates: Candidate[];
  loading: boolean;
  getCandidatesByJob: (jobId: string) => Candidate[];
  getCandidate: (id: string) => Candidate | undefined;
  refresh: () => Promise<void>;
};

const CandidatesContext = createContext<CandidatesContextValue | null>(null);

type CandidatesProviderProps = {
  children: ReactNode;
};

export function CandidatesProvider({ children }: CandidatesProviderProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await api.candidates.list();
    setCandidates(next);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const getCandidatesByJob = useCallback(
    (jobId: string) => candidates.filter((candidate) => candidate.jobId === jobId),
    [candidates],
  );

  const getCandidate = useCallback(
    (id: string) => candidates.find((candidate) => candidate.id === id),
    [candidates],
  );

  const value = useMemo(
    () => ({ candidates, loading, getCandidatesByJob, getCandidate, refresh }),
    [candidates, loading, getCandidatesByJob, getCandidate, refresh],
  );

  return (
    <CandidatesContext.Provider value={value}>{children}</CandidatesContext.Provider>
  );
}

export function useCandidates() {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error('useCandidates must be used within CandidatesProvider');
  }
  return context;
}
