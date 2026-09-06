export type Recruiter = {
  id: string;
  name: string;
  email: string;
};

export type StoredUser = Recruiter & {
  password: string;
};

export type AuthContextValue = {
  user: Recruiter | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
};

export type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
