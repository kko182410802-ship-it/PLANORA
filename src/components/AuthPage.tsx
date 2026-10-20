import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language, User, AppView } from '../types/plan';
import { translations } from '../translations';
import { authService } from '../utils/authService';

interface AuthPageProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  initialMode?: 'login' | 'register' | 'forgot_password';
  onAuthSuccess: (user: User, isGuest?: boolean) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const languages: { code: Language; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KR' },
];

export const AuthPage: React.FC<AuthPageProps> = ({
  currentLang,
  onSelectLang,
  initialMode = 'login',
  onAuthSuccess,
  onClose,
  isModal = false,
}) => {
  const t = translations[currentLang];
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & errors
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const res = authService.login(email, password);
    if (!res.success) {
      const key = res.errorKey as keyof typeof t.auth;
      setErrorMsg(t.auth[key] || t.auth.errInvalidCredentials);
      return;
    }

    if (res.user) {
      onAuthSuccess(res.user, false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password !== confirmPassword) {
      setErrorMsg(t.auth.errPasswordMismatch);
      return;
    }

    const res = authService.register(name, email, password);
    if (!res.success) {
      const key = res.errorKey as keyof typeof t.auth;
      setErrorMsg(t.auth[key] || t.auth.errInvalidCredentials);
      return;
    }

    if (res.user) {
      onAuthSuccess(res.user, false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const res = authService.resetPassword(email, password);
    if (!res.success) {
      const key = res.errorKey as keyof typeof t.auth;
      setErrorMsg(t.auth[key] || t.auth.errUserNotFound);
      return;
    }

    setSuccessMsg(t.auth.resetSuccess);
    setTimeout(() => {
      setMode('login');
      clearMessages();
    }, 2000);
  };

  const handleGuestContinue = () => {
    authService.setSession({ user: null, isGuest: true });
    onAuthSuccess(
      {
        id: 'guest_user',
        name: t.auth.guest,
        email: 'guest@local.storage',
        createdAt: Date.now(),
      },
      true
    );
  };

  const handleFillDemo = () => {
    setEmail('student@planreminder.io');
    setPassword('password123');
    clearMessages();
  };

  return (
    <div
      className={
        isModal
          ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150'
          : 'min-h-screen flex flex-col bg-[#08080a] text-[#fafafa] bg-tech-grid'
      }
    >
      {/* Top Header inside Auth Page if standalone */}
      {!isModal && (
        <header className="border-b border-white/10 bg-[#08080a]/90 backdrop-blur-md py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-white/30 bg-white/5 flex items-center justify-center text-white text-xs font-mono">
                <span className="w-1.5 h-1.5 bg-white" />
              </div>
              <span className="font-display font-medium text-sm tracking-[0.2em] uppercase text-white">
                {t.appName}
              </span>
              <span className="font-mono text-[10px] text-zinc-500 tracking-widest hidden sm:inline">
                // AUTH.SYS
              </span>
            </div>

            {/* Language Switcher in Auth header */}
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
          </div>
        </header>
      )}

      {/* Main Form Center Box */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#0c0c10] border border-white/15 p-6 sm:p-8 font-mono shadow-2xl relative">
          {/* Top modal close or header */}
          {isModal && (
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white" />
                <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
                  USER_SESSION // CONTROL
                </span>
              </div>
              <div className="flex items-center gap-4">
                {/* Language Switcher inside modal */}
                <div className="flex items-center text-[10px] tracking-wider text-zinc-500 border border-white/10 px-1.5 py-0.5 bg-white/5">
                  {languages.map((item, idx) => (
                    <React.Fragment key={item.code}>
                      {idx > 0 && <span className="mx-1 text-zinc-700">/</span>}
                      <button
                        onClick={() => onSelectLang(item.code)}
                        className={`transition-colors uppercase ${
                          currentLang === item.code ? 'text-white font-bold' : 'text-zinc-500'
                        }`}
                      >
                        {item.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                {onClose && (
                  <button onClick={onClose} className="text-zinc-500 hover:text-white text-xs">
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot_password' && (
            <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-4 mb-6 text-xs uppercase tracking-[0.15em]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  clearMessages();
                }}
                className={`py-2 text-center transition-colors border ${
                  mode === 'login'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                01 // {t.auth.signIn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  clearMessages();
                }}
                className={`py-2 text-center transition-colors border ${
                  mode === 'register'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                02 // {t.auth.signUp}
              </button>
            </div>
          )}

          {/* Header Title & Subtitle */}
          <div className="mb-6">
            <h2 className="font-display font-light text-2xl sm:text-3xl uppercase tracking-wider text-white mb-2">
              {mode === 'login'
                ? t.auth.loginTitle
                : mode === 'register'
                ? t.auth.registerTitle
                : t.auth.forgotTitle}
            </h2>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              {mode === 'login'
                ? t.auth.loginSubtitle
                : mode === 'register'
                ? t.auth.registerSubtitle
                : t.auth.forgotSubtitle}
            </p>
          </div>

          {/* Error & Success Banners */}
          {errorMsg && (
            <div className="mb-5 p-3 bg-red-950/30 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] text-zinc-400 tracking-[0.2em] uppercase">
                    {t.auth.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      clearMessages();
                    }}
                    className="text-[10px] text-zinc-500 hover:text-white underline uppercase transition-colors"
                  >
                    {t.auth.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Quick Demo Autofill Hint */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full text-left p-2 border border-dashed border-white/10 hover:border-white/30 bg-white/5 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <span className="text-zinc-500 block mb-0.5">// DEMO SHORTCUT:</span>
                  <span>{t.auth.demoCredentialsHint}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-[0.15em] hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:translate-y-px"
              >
                {t.auth.loginBtn}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t.auth.continueAsGuest}</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.nameLabel}
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.auth.namePlaceholder}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-[0.15em] hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:translate-y-px"
              >
                {t.auth.registerBtn}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearMessages();
                  }}
                  className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
                >
                  {t.auth.alreadyHaveAccount}
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-1.5">
                  {t.auth.newPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-[0.15em] hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:translate-y-px"
              >
                {t.auth.resetBtn}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearMessages();
                  }}
                  className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t.auth.backToLogin}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer isolation notice */}
          <div className="mt-8 pt-4 border-t border-white/10 text-[10px] text-zinc-500 tracking-wider flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>{t.auth.isolatedNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
