import { isMockMode } from './config';
import { liveApi } from './live';
import { mockApi } from '../mocks';
import type { HireMindApi } from './services/types';

export const api: HireMindApi = isMockMode ? mockApi : liveApi;

export { isMockMode, API_MODE, API_BASE_URL } from './config';
export type { HireMindApi } from './services/types';
