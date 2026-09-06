import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthContextValue, Recruiter, StoredUser } from '../types/auth';

const USERS_KEY = 'recruitment_users';
const SESSION_KEY = 'recruitment_session';

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): Recruiter | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Recruiter;
  } catch {
    return null;
  }
}

function saveSession(user: Recruiter | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Recruiter | null>(() => loadSession());

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = loadUsers().find(
      (u) => u.email === normalizedEmail && u.password === password,
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const sessionUser: Recruiter = {
      id: found.id,
      name: found.name,
      email: found.email,
    };

    saveSession(sessionUser);
    setUser(sessionUser);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const users = loadUsers();

      if (users.some((u) => u.email === normalizedEmail)) {
        throw new Error('An account with this email already exists');
      }

      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      saveUsers([...users, newUser]);

      const sessionUser: Recruiter = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      saveSession(sessionUser);
      setUser(sessionUser);
    },
    [],
  );

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
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
