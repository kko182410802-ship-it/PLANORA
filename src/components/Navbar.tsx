import React from 'react';
import { Plus, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import { Language, User } from '../types/plan';
import { translations } from '../translations';

interface NavbarProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenAddModal: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  user: User | null;
  isGuest: boolean;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

const languages: { code: Language; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KR' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  onOpenAddModal,
  onNavigate,
  activeSection,
  user,
  isGuest,
  onOpenAuth,
  onLogout,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-[#08080a]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Lockup: Futuristic Industrial Editorial */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => onNavigate('hero')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-none border border-white/30 bg-white/5 flex items-center justify-center text-white text-xs font-mono group-hover:border-white transition-colors">
              <span className="w-2 h-2 bg-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-medium text-base tracking-[0.2em] uppercase text-white group-hover:text-zinc-300 transition-colors">
                  {t.appName}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 tracking-widest hidden sm:inline-block">
                  // SYS.01
                </span>
              </div>
              <p className="text-[11px] font-mono tracking-widest uppercase text-zinc-500 hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Navigation Links with thin indicators */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-[0.2em] uppercase">
          <button
            onClick={() => onNavigate('hero')}
            className={`py-1 relative transition-colors ${
              activeSection === 'hero'
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {activeSection === 'hero' && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
                —
              </span>
            )}
            {t.nav.home}
          </button>
          <button
            onClick={() => onNavigate('plans')}
            className={`py-1 relative transition-colors ${
              activeSection === 'plans'
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {activeSection === 'plans' && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
                —
              </span>
            )}
            {t.nav.myPlans}
          </button>
        </nav>

        {/* Right Actions: User Account, Minimalist RU/EN/KR switcher & Add Button */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* User Account / Session Profile Pill */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {user && !isGuest ? (
              <div className="flex items-center gap-2 border border-white/15 px-2.5 py-1 bg-white/5">
                <UserIcon className="w-3 h-3 text-zinc-400" />
                <span className="text-zinc-300 uppercase tracking-wider text-[11px] max-w-[110px] sm:max-w-[150px] truncate">
                  {user.name}
                </span>
                <span className="text-zinc-600">|</span>
                <button
                  onClick={onLogout}
                  title={t.auth.signOut}
                  className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 uppercase text-[10px] tracking-widest"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">{t.auth.signOut}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="border border-dashed border-white/20 text-zinc-500 px-2 py-1 uppercase text-[10px] tracking-widest hidden sm:inline-block">
                  {t.auth.guest}
                </span>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 border border-white/20 hover:border-white px-2.5 py-1 text-zinc-300 hover:text-white uppercase text-[11px] tracking-wider transition-colors bg-white/5"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{t.auth.signIn}</span>
                </button>
              </div>
            )}
          </div>

          {/* Minimal Language Switcher: RU / EN / KR with thin line */}
          <div className="flex items-center font-mono text-xs tracking-wider text-zinc-500 border border-white/10 px-2 py-1 bg-white/5">
            {languages.map((item, idx) => (
              <React.Fragment key={item.code}>
                {idx > 0 && <span className="mx-1.5 text-zinc-700">/</span>}
                <button
                  onClick={() => onSelectLang(item.code)}
                  className={`transition-colors py-0.5 px-1 uppercase ${
                    currentLang === item.code
                      ? 'text-white font-bold underline underline-offset-4 decoration-white/60'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Sharp Metallic Action Button */}
          <button
            onClick={onOpenAddModal}
            className="group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 bg-white hover:bg-zinc-200 text-black text-xs font-mono uppercase tracking-[0.15em] font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:translate-y-px"
          >
            <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-200" />
            <span className="whitespace-nowrap hidden sm:inline">{t.hero.addBtn}</span>
            <span className="sm:hidden">{t.nav.addPlan}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
