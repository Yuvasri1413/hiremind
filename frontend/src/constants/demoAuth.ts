import type { StoredUser } from '../types/auth';

/** Hardcoded demo account for mock mode / local testing */
export const DEMO_EMAIL = 'recruiter@hiremind.com';
export const DEMO_PASSWORD = 'password123';

export const demoUser: StoredUser = {
  id: 'demo-recruiter-1',
  name: 'Demo Recruiter',
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
};

export const DEMO_LOGIN_HINT = `Demo: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`;
