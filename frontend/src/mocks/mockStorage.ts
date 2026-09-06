export const MOCK_STORAGE_KEYS = {
  users: 'hiremind_mock_users',
  session: 'hiremind_mock_session',
  jobs: 'hiremind_mock_jobs',
  candidates: 'hiremind_mock_candidates',
  passwordResets: 'hiremind_mock_password_resets',
  workflow: (jobId: string) => `hiremind_mock_workflow_${jobId}`,
  uploads: (jobId: string) => `hiremind_mock_uploads_${jobId}`,
} as const;

type PasswordResetRecord = {
  token: string;
  expiresAt: string;
};

export function readMockStorage<T>(key: string, seed: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return seed;
  try {
    const parsed = JSON.parse(raw) as T;
    if (Array.isArray(parsed) && parsed.length === 0) return seed;
    return parsed;
  } catch {
    return seed;
  }
}

export function writeMockStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function clearMockStorage(key: string) {
  localStorage.removeItem(key);
}

/** Simulate network latency in mock mode (optional). */
export async function mockDelay<T>(value: T, ms = 0): Promise<T> {
  if (ms <= 0) return value;
  await new Promise((resolve) => setTimeout(resolve, ms));
  return value;
}
