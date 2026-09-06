import type { AuthService, PasswordResetResponse } from '../../api/services/types';
import { demoUser } from '../../constants/demoAuth';
import type { Recruiter, StoredUser } from '../../types/auth';
import { MOCK_STORAGE_KEYS, mockDelay, readMockStorage, writeMockStorage } from '../mockStorage';

type ResetTokenMap = Record<string, { token: string; expiresAt: string }>;

const RESET_MESSAGE =
  'If an account exists for this email, you will receive password reset instructions.';

function loadUsers(): StoredUser[] {
  const stored = readMockStorage<StoredUser[]>(MOCK_STORAGE_KEYS.users, []);
  if (stored.length === 0) return [demoUser];

  const hasDemo = stored.some((user) => user.email === demoUser.email);
  if (!hasDemo) return [demoUser, ...stored];

  return stored;
}

function saveUsers(users: StoredUser[]) {
  writeMockStorage(MOCK_STORAGE_KEYS.users, users);
}

function loadSession(): Recruiter | null {
  return readMockStorage<Recruiter | null>(MOCK_STORAGE_KEYS.session, null);
}

function saveSession(user: Recruiter | null) {
  if (user) writeMockStorage(MOCK_STORAGE_KEYS.session, user);
  else localStorage.removeItem(MOCK_STORAGE_KEYS.session);
}

function loadResetTokens(): ResetTokenMap {
  return readMockStorage<ResetTokenMap>(MOCK_STORAGE_KEYS.passwordResets, {});
}

function saveResetTokens(tokens: ResetTokenMap) {
  writeMockStorage(MOCK_STORAGE_KEYS.passwordResets, tokens);
}

export const mockAuthService: AuthService = {
  async getSession() {
    return mockDelay(loadSession());
  },

  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const found = loadUsers().find(
      (user) => user.email === normalizedEmail && user.password === password,
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
    return mockDelay(sessionUser);
  },

  async register(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = loadUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
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
    return mockDelay(sessionUser);
  },

  async logout() {
    saveSession(null);
  },

  async changePassword(userId, currentPassword, newPassword) {
    const users = loadUsers();
    const index = users.findIndex((user) => user.id === userId);

    if (index === -1) {
      throw new Error('Account not found');
    }

    if (users[index].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (currentPassword === newPassword) {
      throw new Error('New password must be different from current password');
    }

    const updated = [...users];
    updated[index] = { ...updated[index], password: newPassword };
    saveUsers(updated);
  },

  async requestPasswordReset(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const userExists = loadUsers().some((user) => user.email === normalizedEmail);

    const response: PasswordResetResponse = { message: RESET_MESSAGE };

    if (userExists) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const tokens = loadResetTokens();
      tokens[normalizedEmail] = { token, expiresAt };
      saveResetTokens(tokens);
      response.resetToken = token;
      response.email = normalizedEmail;
    }

    return mockDelay(response);
  },

  async resetPassword(email, token, newPassword) {
    const normalizedEmail = email.trim().toLowerCase();
    const tokens = loadResetTokens();
    const record = tokens[normalizedEmail];

    if (!record || record.token !== token) {
      throw new Error('Invalid or expired reset link');
    }

    if (new Date(record.expiresAt) < new Date()) {
      throw new Error('Reset link has expired. Please request a new one.');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const users = loadUsers();
    const index = users.findIndex((user) => user.email === normalizedEmail);
    if (index === -1) {
      throw new Error('Account not found');
    }

    const updated = [...users];
    updated[index] = { ...updated[index], password: newPassword };
    saveUsers(updated);

    const nextTokens = { ...tokens };
    delete nextTokens[normalizedEmail];
    saveResetTokens(nextTokens);
  },
};
