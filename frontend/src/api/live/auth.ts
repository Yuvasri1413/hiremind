import type { AuthService } from '../services/types';
import { mapRecruiter } from './mappers';
import { liveFetch } from './liveFetch';
import { getToken, setToken } from './tokenStorage';

type TokenResponse = { access_token: string };

export const liveAuthService: AuthService = {
  async getSession() {
    if (!getToken()) return null;
    try {
      const user = await liveFetch<{ id: string; name: string; email: string }>('/auth/me');
      return mapRecruiter(user);
    } catch {
      setToken(null);
      return null;
    }
  },

  async login(email, password) {
    const tokenResponse = await liveFetch<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(tokenResponse.access_token);
    const user = await liveFetch<{ id: string; name: string; email: string }>('/auth/me');
    return mapRecruiter(user);
  },

  async register(name, email, password) {
    await liveFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    const tokenResponse = await liveFetch<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(tokenResponse.access_token);
    const user = await liveFetch<{ id: string; name: string; email: string }>('/auth/me');
    return mapRecruiter(user);
  },

  async logout() {
    setToken(null);
  },

  async changePassword(_userId, currentPassword, newPassword) {
    await liveFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },

  async requestPasswordReset() {
    throw new Error('Password reset is not available on the live API yet.');
  },

  async resetPassword() {
    throw new Error('Password reset is not available on the live API yet.');
  },
};
