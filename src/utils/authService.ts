import { User, AuthSession } from '../types/plan';

const USERS_STORAGE_KEY = 'plan_reminder_users_v1';
const SESSION_STORAGE_KEY = 'plan_reminder_session_v1';

// Seed default student account if none exists
const DEFAULT_USER: User = {
  id: 'user_student_demo',
  name: 'Alex Mercer',
  email: 'student@planreminder.io',
  password: 'password123',
  createdAt: Date.now() - 86400000 * 7,
};

export const authService = {
  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        const users = JSON.parse(raw);
        if (Array.isArray(users) && users.length > 0) {
          return users;
        }
      }
    } catch (e) {
      console.warn('Failed to parse users from localStorage', e);
    }
    // Seed default user
    const initial = [DEFAULT_USER];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users to localStorage', e);
    }
  },

  register(name: string, email: string, password: string): { success: boolean; user?: User; errorKey?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, errorKey: 'errNameRequired' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, errorKey: 'errEmailInvalid' };
    }
    if (!password || password.length < 6) {
      return { success: false, errorKey: 'errPasswordShort' };
    }

    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, errorKey: 'errUserExists' };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      email: trimmedEmail,
      password,
      createdAt: Date.now(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Automatically set session
    this.setSession({ user: newUser, isGuest: false });
    return { success: true, user: newUser };
  },

  login(email: string, password: string): { success: boolean; user?: User; errorKey?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!user) {
      return { success: false, errorKey: 'errInvalidCredentials' };
    }

    this.setSession({ user, isGuest: false });
    return { success: true, user };
  },

  resetPassword(email: string, newPassword: string): { success: boolean; errorKey?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, errorKey: 'errEmailInvalid' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, errorKey: 'errPasswordShort' };
    }

    const users = this.getUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (index === -1) {
      return { success: false, errorKey: 'errUserNotFound' };
    }

    users[index].password = newPassword;
    this.saveUsers(users);

    return { success: true };
  },

  getSession(): AuthSession {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && (session.user || session.isGuest)) {
          return session;
        }
      }
    } catch (e) {
      console.warn('Failed to read session', e);
    }
    // Default: Check if default user exists, but start in logged-in demo or guest session so initial experience is immediate, or if not authenticated prompt login
    return { user: DEFAULT_USER, isGuest: false };
  },

  setSession(session: AuthSession): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session', e);
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
  },
};
