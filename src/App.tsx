import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  User as UserIcon,
} from 'lucide-react';
import { Plan, Language, FilterType, SortType, ToastMessage, User, AuthSession } from './types/plan';
import { translations } from './translations';
import { createDemoPlans, getPlanDateTime } from './utils/dateUtils';
import { authService } from './utils/authService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NearestPlanCard } from './components/NearestPlanCard';
import { PlanCard } from './components/PlanCard';
import { PlanModal } from './components/PlanModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';

const STORAGE_KEY_LANG = 'plan_reminder_lang_v1';

function getUserStorageKey(user: User | null, isGuest: boolean): string {
  if (user) {
    return `plan_reminder_plans_user_${user.id}`;
  }
  if (isGuest) {
    return 'plan_reminder_plans_guest';
  }
  return 'plan_reminder_plans_anonymous';
}

export default function App() {
  // 1. Language state
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'ru' || saved === 'en' || saved === 'ko') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'ru';
  });

  const t = translations[lang];

  // Sync html lang attribute & persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  }, [lang]);

  // 2. Authentication & Session state
  const [session, setSession] = useState<AuthSession>(() => authService.getSession());
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password' | null>(null);

  // 3. Real-time ticker: updates every second
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. User-Isolated Plans state
  // Plans are strictly loaded and saved under the active user's storage key
  const [plans, setPlans] = useState<Plan[]>(() => {
    const initialSession = authService.getSession();
    const key = getUserStorageKey(initialSession.user, initialSession.isGuest);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load user plans from localStorage', e);
    }
    return createDemoPlans();
  });

  // Whenever the active session changes (user logs in, registers, switches account or logs out),
  // reload that specific user's isolated plans from their key!
  useEffect(() => {
    const key = getUserStorageKey(session.user, session.isGuest);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPlans(parsed);
          return;
        }
      }
      // If user has no plans yet in their account, seed initial isolated plans
      const newDemos = createDemoPlans();
      localStorage.setItem(key, JSON.stringify(newDemos));
      setPlans(newDemos);
    } catch (e) {
      console.warn('Failed to switch isolated user plans', e);
      setPlans(createDemoPlans());
    }
  }, [session.user?.id, session.isGuest]);

  // Save plans strictly to the current user's storage key
  useEffect(() => {
    const key = getUserStorageKey(session.user, session.isGuest);
    try {
      localStorage.setItem(key, JSON.stringify(plans));
    } catch (e) {
      console.warn('Failed to save plans to user storage', e);
    }
  }, [plans, session.user?.id, session.isGuest]);

  // 5. UI Filters & Search
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('nearest');
  const [activeSection, setActiveSection] = useState<'hero' | 'plans'>('hero');

  // 6. Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteModalPlan, setDeleteModalPlan] = useState<Plan | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auth Handlers
  const handleAuthSuccess = (user: User, isGuest = false) => {
    const newSession: AuthSession = { user: isGuest ? null : user, isGuest };
    authService.setSession(newSession);
    setSession(newSession);
    setAuthModalMode(null);
    if (!isGuest) {
      addToast(t.auth.loginSuccess, 'success');
    }
  };

  const handleLogout = () => {
    authService.clearSession();
    // Switch to guest session and open login view
    const guestSession: AuthSession = { user: null, isGuest: true };
    authService.setSession(guestSession);
    setSession(guestSession);
    addToast(t.auth.logoutSuccess, 'info');
    setAuthModalMode('login');
  };

  // Navigation smoothly
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId as 'hero' | 'plans');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find Nearest Plan:
  const nearestPlan = useMemo(() => {
    const uncompletedPlans = plans.filter((p) => !p.completed);
    if (uncompletedPlans.length === 0) return null;

    const upcoming = uncompletedPlans
      .map((p) => ({
        plan: p,
        diff: getPlanDateTime(p.date, p.time).getTime() - now,
      }))
      .filter((item) => item.diff >= 0)
      .sort((a, b) => a.diff - b.diff);

    if (upcoming.length > 0) {
      return upcoming[0].plan;
    }

    const past = uncompletedPlans
      .map((p) => ({
        plan: p,
        diff: getPlanDateTime(p.date, p.time).getTime() - now,
      }))
      .sort((a, b) => b.diff - a.diff);

    return past[0]?.plan || null;
  }, [plans, now]);

  // Quick statistics
  const stats = useMemo(() => {
    const total = plans.length;
    const completedCount = plans.filter((p) => p.completed).length;

    const todayStr = new Date(now).toISOString().split('T')[0];
    const todayCount = plans.filter((p) => !p.completed && p.date === todayStr).length;

    return { total, completedCount, todayCount };
  }, [plans, now]);

  // Counts for filter pills
  const filterCounts = useMemo(() => {
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;

    plans.forEach((p) => {
      if (p.completed) {
        completed++;
      } else {
        const timeDiff = getPlanDateTime(p.date, p.time).getTime() - now;
        if (timeDiff < 0) {
          overdue++;
        } else {
          upcoming++;
        }
      }
    });

    return {
      all: plans.length,
      upcoming,
      overdue,
      completed,
    };
  }, [plans, now]);

  // Filtered and sorted plans for "My Plans"
  const displayedPlans = useMemo(() => {
    let result = [...plans];

    if (activeFilter === 'upcoming') {
      result = result.filter(
        (p) => !p.completed && getPlanDateTime(p.date, p.time).getTime() - now >= 0
      );
    } else if (activeFilter === 'overdue') {
      result = result.filter(
        (p) => !p.completed && getPlanDateTime(p.date, p.time).getTime() - now < 0
      );
    } else if (activeFilter === 'completed') {
      result = result.filter((p) => p.completed);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.note && p.note.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const timeA = getPlanDateTime(a.date, a.time).getTime();
      const timeB = getPlanDateTime(b.date, b.time).getTime();

      if (sortBy === 'furthest') {
        return timeB - timeA;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return timeA - timeB;
    });

    return result;
  }, [plans, activeFilter, searchQuery, sortBy, now]);

  // Plan actions
  const handleSavePlan = (
    data: Omit<Plan, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setPlans((prev) =>
        prev.map((p) => (p.id === existingId ? { ...p, ...data } : p))
      );
      addToast(t.toasts.updated, 'success');
    } else {
      const newPlan: Plan = {
        ...data,
        id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        createdAt: Date.now(),
      };
      setPlans((prev) => [newPlan, ...prev]);
      addToast(t.toasts.added, 'success');
    }
    setEditingPlan(null);
  };

  const handleToggleComplete = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.completed;
          if (nextState) {
            addToast(t.toasts.completed, 'success');
          } else {
            addToast(t.toasts.uncompleted, 'info');
          }
          return { ...p, completed: nextState };
        }
        return p;
      })
    );
  };

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteModalPlan) return;
    setPlans((prev) => prev.filter((p) => p.id !== deleteModalPlan.id));
    addToast(t.toasts.deleted, 'info');
    setDeleteModalPlan(null);
  };

  const handleRestoreDemo = () => {
    const demos = createDemoPlans();
    setPlans(demos);
    addToast(t.toasts.demoRestored, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-[#fafafa] selection:bg-white selection:text-black">
      {/* Top Navigation with Session Status & Language Switcher */}
      <Navbar
        currentLang={lang}
        onSelectLang={setLang}
        onOpenAddModal={() => {
          setEditingPlan(null);
          setIsModalOpen(true);
        }}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        user={session.user}
        isGuest={session.isGuest}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onLogout={handleLogout}
      />

      {/* Main App Content */}
      <main className="flex-1">
        {/* User Workspace Identification Strip */}
        <div className="border-b border-white/5 bg-black/40 py-1.5 px-4 sm:px-8 font-mono text-[10px] text-zinc-500 tracking-widest flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>SESSION: {session.user ? session.user.email : t.auth.guest}</span>
            <span className="text-zinc-700">//</span>
            <span>STORAGE: ISOLATED_LOCAL</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-zinc-600">
            <span>[DATA ENCRYPTION: ACTIVE]</span>
          </div>
        </div>

        {/* Futuristic Hero Section */}
        <Hero
          currentLang={lang}
          onOpenAddModal={() => {
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
          onScrollToPlans={() => handleNavigate('plans')}
          stats={stats}
        />

        {/* Nearest Plan Editorial Information Panel */}
        <NearestPlanCard
          plan={nearestPlan}
          now={now}
          currentLang={lang}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditClick}
          onAddNew={() => {
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
        />

        {/* "My Plans" Section: Horizontal Editorial Rows with Thin Dividers */}
        <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-20">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
            <div>
              <div className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-2">
                02 // DIRECTORY & ARCHIVE
              </div>
              <h2 className="font-display font-light text-3xl sm:text-5xl uppercase tracking-[0.05em] text-white">
                {t.plansSection.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 max-w-lg tracking-wide">
                {t.plansSection.subtitle}
              </p>
            </div>

            {/* Quick Add Plan Button for Section */}
            <button
              onClick={() => {
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-mono text-xs uppercase tracking-[0.15em] font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:translate-y-px"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.hero.addBtn}</span>
            </button>
          </div>

          {/* Minimalist Filter Tabs, Search, and Sort Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 font-mono text-xs">
            {/* Filter Tabs as Minimalist Segmented List */}
            <div className="flex flex-wrap items-center gap-2 border-b md:border-b-0 border-white/10 pb-3 md:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 uppercase tracking-wider transition-colors border ${
                  activeFilter === 'all'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{t.plansSection.filterAll}</span>
                <span className="ml-2 opacity-60">[{String(filterCounts.all).padStart(2, '0')}]</span>
              </button>

              <button
                onClick={() => setActiveFilter('upcoming')}
                className={`px-3 py-1.5 uppercase tracking-wider transition-colors border ${
                  activeFilter === 'upcoming'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{t.plansSection.filterUpcoming}</span>
                <span className="ml-2 opacity-60">[{String(filterCounts.upcoming).padStart(2, '0')}]</span>
              </button>

              <button
                onClick={() => setActiveFilter('overdue')}
                className={`px-3 py-1.5 uppercase tracking-wider transition-colors border ${
                  activeFilter === 'overdue'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{t.plansSection.filterOverdue}</span>
                <span className="ml-2 opacity-60">[{String(filterCounts.overdue).padStart(2, '0')}]</span>
              </button>

              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1.5 uppercase tracking-wider transition-colors border ${
                  activeFilter === 'completed'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>{t.plansSection.filterCompleted}</span>
                <span className="ml-2 opacity-60">[{String(filterCounts.completed).padStart(2, '0')}]</span>
              </button>
            </div>

            {/* Search and Sort controls */}
            <div className="flex items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.plansSection.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                />
              </div>

              {/* Sort Selector */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  aria-label={t.plansSection.sortBy}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-black/40 border border-white/15 text-xs text-zinc-300 uppercase tracking-wider focus:outline-hidden focus:border-white cursor-pointer"
                >
                  <option value="nearest" className="bg-[#0e0e12] text-white">{t.plansSection.sortNearest}</option>
                  <option value="furthest" className="bg-[#0e0e12] text-white">{t.plansSection.sortFurthest}</option>
                  <option value="title" className="bg-[#0e0e12] text-white">{t.plansSection.sortTitle}</option>
                </select>
                <SlidersHorizontal className="w-3 h-3 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Editorial Horizontal Rows */}
          {plans.length === 0 ? (
            <EmptyState
              currentLang={lang}
              onAddNew={() => {
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
            />
          ) : displayedPlans.length === 0 ? (
            <EmptyState
              currentLang={lang}
              isFilterEmpty={true}
              onClearFilter={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              onAddNew={() => {
                setEditingPlan(null);
                setIsModalOpen(true);
              }}
            />
          ) : (
            <div className="border-t border-white/10">
              {displayedPlans.map((plan, idx) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  index={idx}
                  now={now}
                  currentLang={lang}
                  isNearest={nearestPlan?.id === plan.id}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditClick}
                  onDeleteRequest={(p) => setDeleteModalPlan(p)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer currentLang={lang} onRestoreDemo={handleRestoreDemo} />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      {authModalMode && (
        <AuthPage
          currentLang={lang}
          onSelectLang={setLang}
          initialMode={authModalMode}
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setAuthModalMode(null)}
          isModal={true}
        />
      )}

      {/* Add / Edit Modal */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
        currentLang={lang}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteModalPlan)}
        planTitle={deleteModalPlan?.title || ''}
        currentLang={lang}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalPlan(null)}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
