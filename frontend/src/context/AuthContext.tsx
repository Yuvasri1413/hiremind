import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, isMockMode } from '../api';
import { MOCK_STORAGE_KEYS, readMockStorage } from '../mocks/mockStorage';
import type { AuthContextValue, Recruiter } from '../types/auth';

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialSession(): Recruiter | null {
  if (!isMockMode) return null;
  return readMockStorage<Recruiter | null>(MOCK_STORAGE_KEYS.session, null);
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Recruiter | null>(getInitialSession);

  useEffect(() => {
    if (!isMockMode) {
      api.auth.getSession().then(setUser);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const sessionUser = await api.auth.login(email, password);
    setUser(sessionUser);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const sessionUser = await api.auth.register(name, email, password);
    setUser(sessionUser);
  }, []);

  const logout = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) throw new Error('Not authenticated');
      await api.auth.changePassword(user.id, currentPassword, newPassword);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      changePassword,
      logout,
    }),
    [user, login, register, changePassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
