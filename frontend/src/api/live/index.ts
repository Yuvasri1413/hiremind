import type { HireMindApi } from '../services/types';

const LIVE_API_MESSAGE =
  'Live API is not connected yet. Set VITE_API_MODE=mock in .env or start the backend.';

function rejectLive(): Promise<never> {
  return Promise.reject(new Error(LIVE_API_MESSAGE));
}

function createLiveStub<T extends object>(): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      if (prop === 'then') return undefined;
      return () => rejectLive();
    },
  });
}

export const liveApi: HireMindApi = {
  auth: createLiveStub(),
  jobs: createLiveStub(),
  candidates: createLiveStub(),
  workflows: createLiveStub(),
  uploads: createLiveStub(),
  requirements: createLiveStub(),
  candidateReports: createLiveStub(),
};
