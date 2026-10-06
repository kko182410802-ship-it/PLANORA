import React from 'react';
import { Check, Edit3, ArrowRight, CornerDownRight } from 'lucide-react';
import { Plan, Language } from '../types/plan';
import { translations } from '../translations';
import { calculateCountdown, formatPlanDate } from '../utils/dateUtils';

interface NearestPlanCardProps {
  plan: Plan | null;
  now: number;
  currentLang: Language;
  onToggleComplete: (id: string) => void;
  onEdit: (plan: Plan) => void;
  onAddNew: () => void;
}

export const NearestPlanCard: React.FC<NearestPlanCardProps> = ({
  plan,
  now,
  currentLang,
  onToggleComplete,
  onEdit,
  onAddNew,
}) => {
  const t = translations[currentLang];

  if (!plan) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="border border-white/15 bg-[#0e0e12] p-8 sm:p-12 text-left relative overflow-hidden">
          <div className="font-mono text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-4">
            [SECTION // IMMINENT_PLAN]
          </div>
          <h2 className="font-display font-light text-2xl sm:text-4xl text-white uppercase tracking-wider mb-3">
            {t.nearest.allDoneTitle}
          </h2>
          <p className="text-sm text-zinc-400 font-light max-w-md mb-8">
            {t.nearest.allDoneSubtitle}
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-3 px-5 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-200 transition-colors"
          >
            <span>{t.nearest.addFirstPlan}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    );
  }

  const countdown = calculateCountdown(plan.date, plan.time, now, currentLang);
  const formattedDate = formatPlanDate(plan.date, plan.time, currentLang);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Editorial Information Panel with 1px border and sharp geometry */}
      <div className="relative border border-white/15 bg-[#0c0c10] overflow-hidden">
        {/* Top Header Row with Technical Label & Minimal Controls */}
        <div className="px-6 sm:px-10 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-white inline-block" />
            <span className="tracking-[0.25em] uppercase text-zinc-400">
              01 // NEXT PLAN
            </span>
            <span className="text-zinc-600">//</span>
            <span className="text-zinc-500 tracking-widest uppercase">
              {countdown.isOverdue ? t.nearest.overdue : t.nearest.badge}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onEdit(plan)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white uppercase tracking-[0.15em] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.nearest.edit}</span>
            </button>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => onToggleComplete(plan.id)}
              className="flex items-center gap-1.5 text-zinc-200 hover:text-white uppercase tracking-[0.15em] font-medium transition-colors border border-white/20 px-3 py-1 bg-white/5 hover:bg-white hover:text-black"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.nearest.markDone}</span>
            </button>
          </div>
        </div>

        {/* Huge Typography Section: Title, Date, Countdown */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Plan Title */}
          <div>
            <div className="font-mono text-[11px] tracking-[0.25em] text-zinc-500 uppercase mb-2">
              TARGET SPECIFICATION
            </div>
            <h2 className="font-display font-light text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-[0.05em] leading-[1.05] break-words">
              {plan.title}
            </h2>
          </div>

          {/* Thin horizontal line */}
          <div className="border-t border-white/10" />

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <div className="md:col-span-3 font-mono text-[11px] tracking-[0.25em] text-zinc-500 uppercase">
              SCHEDULED TIMESTAMP
            </div>
            <div className="md:col-span-9 font-display text-2xl sm:text-4xl text-zinc-200 tracking-wider uppercase font-light">
              {formattedDate}
            </div>
          </div>

          {/* Thin horizontal line */}
          <div className="border-t border-white/10" />

          {/* Large Countdown Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
            <div className="md:col-span-3 font-mono text-[11px] tracking-[0.25em] text-zinc-500 uppercase">
              {t.nearest.timeLeft}
            </div>
            <div className="md:col-span-9">
              {/* Massive Countdown Numbers */}
              <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center font-mono">
                {/* Days */}
                <div className="border border-white/10 bg-black/40 p-4 sm:p-6">
                  <div className="text-3xl sm:text-6xl md:text-7xl font-light text-white font-mono-numbers tracking-tight">
                    {String(countdown.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-500 tracking-[0.2em] uppercase mt-2">
                    {t.nearest.days}
                  </div>
                </div>

                {/* Hours */}
                <div className="border border-white/10 bg-black/40 p-4 sm:p-6">
                  <div className="text-3xl sm:text-6xl md:text-7xl font-light text-white font-mono-numbers tracking-tight">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-500 tracking-[0.2em] uppercase mt-2">
                    {t.nearest.hours}
                  </div>
                </div>

                {/* Minutes */}
                <div className="border border-white/10 bg-black/40 p-4 sm:p-6">
                  <div className="text-3xl sm:text-6xl md:text-7xl font-light text-white font-mono-numbers tracking-tight">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-500 tracking-[0.2em] uppercase mt-2">
                    {t.nearest.minutes}
                  </div>
                </div>

                {/* Seconds */}
                <div className="border border-white/10 bg-black/40 p-4 sm:p-6 relative">
                  <div className="text-3xl sm:text-6xl md:text-7xl font-light text-white font-mono-numbers tracking-tight">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-400 tracking-[0.2em] uppercase mt-2 flex items-center justify-center gap-1">
                    <span className="w-1 h-1 bg-white inline-block animate-ping" />
                    <span>{t.nearest.seconds}</span>
                  </div>
                </div>
              </div>

              {/* Natural Text representation */}
              <div className="mt-4 font-mono text-xs text-zinc-400 tracking-wider flex items-center gap-2">
                <CornerDownRight className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-500 uppercase">{t.nearest.timeLeft}:</span>
                <span className="text-white uppercase font-medium">{countdown.formattedText}</span>
              </div>
            </div>
          </div>

          {/* Note Section (if present) */}
          {plan.note && (
            <>
              <div className="border-t border-white/10" />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline font-mono text-xs">
                <div className="md:col-span-3 text-[11px] tracking-[0.25em] text-zinc-500 uppercase">
                  ADDITIONAL NOTES
                </div>
                <div className="md:col-span-9 text-zinc-300 font-light leading-relaxed border-l border-white/20 pl-4 py-1">
                  {plan.note}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
