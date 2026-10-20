export type PlanCategory = 'study' | 'exam' | 'project' | 'meeting' | 'personal' | 'other';

export type Language = 'ru' | 'en' | 'ko';

export type FilterType = 'all' | 'upcoming' | 'overdue' | 'completed';

export type SortType = 'nearest' | 'furthest' | 'title';

export type AppView = 'app' | 'login' | 'register' | 'forgot_password';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: number;
}

export interface AuthSession {
  user: User | null;
  isGuest: boolean;
}

export interface Plan {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  note?: string;
  category?: PlanCategory;
  completed: boolean;
  createdAt: number;
}

export interface TimeCountdown {
  totalMs: number;
  isOverdue: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedText: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}
