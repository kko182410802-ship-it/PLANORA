import React, { useState } from 'react';
import { Check, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Plan, Language } from '../types/plan';
import { translations } from '../translations';
import { calculateCountdown, formatPlanDate } from '../utils/dateUtils';

interface PlanCardProps {
  plan: Plan;
  index: number;
  now: number;
  currentLang: Language;
  isNearest: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (plan: Plan) => void;
  onDeleteRequest: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  now,
  currentLang,
  isNearest,
  onToggleComplete,
  onEdit,
  onDeleteRequest,
}) => {
  const [noteExpanded, setNoteExpanded] = useState(false);
  const t = translations[currentLang];
  const countdown = calculateCountdown(plan.date, plan.time, now, currentLang);
  const formattedDate = formatPlanDate(plan.date, plan.time, currentLang);
  const isOverdue = !plan.completed && countdown.isOverdue;

  const paddedIndex = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`group relative border-b border-white/10 transition-colors py-6 sm:py-8 ${
        plan.completed
          ? 'bg-black/20 opacity-50'
          : isNearest
          ? 'bg-white/[0.02]'
          : 'hover:bg-white/[0.01]'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start sm:items-center">
        {/* Column 1: Index Number & Checkbox */}
        <div className="lg:col-span-2 flex items-center gap-4">
          <button
            onClick={() => onToggleComplete(plan.id)}
            className={`w-6 h-6 border flex items-center justify-center transition-colors shrink-0 ${
              plan.completed
                ? 'bg-white border-white text-black'
                : 'border-white/30 hover:border-white text-transparent hover:text-white/40'
            }`}
            title={plan.completed ? t.plansSection.toggleIncomplete : t.plansSection.toggleComplete}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <span className="font-mono text-3xl sm:text-4xl font-light text-zinc-600 group-hover:text-zinc-400 transition-colors select-none">
            {paddedIndex}
          </span>

          {isNearest && !plan.completed && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-300 border border-white/30 px-1.5 py-0.5">
              NEXT
            </span>
          )}
        </div>

        {/* Column 2: Title & Category */}
        <div className="lg:col-span-5 min-w-0">
          <div className="flex items-center gap-2 mb-1 font-mono text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
            {plan.category && <span>{t.categories[plan.category]}</span>}
            {isOverdue && (
              <span className="text-zinc-300 bg-white/10 px-1.5 py-0.2 border border-white/20">
                {t.plansSection.overdueBadge}
              </span>
            )}
            {plan.completed && (
              <span className="text-zinc-500 border border-white/10 px-1.5 py-0.2">
                {t.plansSection.completedBadge}
              </span>
            )}
          </div>

          <h3
            onClick={() => onToggleComplete(plan.id)}
            className={`font-display text-lg sm:text-2xl font-light uppercase tracking-wide cursor-pointer transition-colors ${
              plan.completed
                ? 'line-through text-zinc-600'
                : 'text-white group-hover:text-zinc-200'
            }`}
          >
            {plan.title}
          </h3>
        </div>

        {/* Column 3: Scheduled Date & Remaining Time */}
        <div className="lg:col-span-3 font-mono text-xs space-y-1">
          <div className="text-zinc-300 font-medium uppercase tracking-wider">
            {formattedDate}
          </div>
          <div className="text-zinc-500 tracking-wider">
            {plan.completed ? (
              <span className="text-zinc-600 uppercase">—</span>
            ) : isOverdue ? (
              <span className="text-zinc-400 uppercase tracking-widest">{t.plansSection.overdueBadge}</span>
            ) : (
              <span className="text-zinc-400 uppercase">
                {t.nearest.timeLeft}: {countdown.formattedText}
              </span>
            )}
          </div>
        </div>

        {/* Column 4: Minimalist Integrated Actions (Note, Edit, Delete) */}
        <div className="lg:col-span-2 flex items-center justify-end gap-3 sm:gap-4 font-mono text-xs">
          {plan.note && (
            <button
              onClick={() => setNoteExpanded((prev) => !prev)}
              className="text-zinc-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
              title={t.plansSection.noteLabel}
            >
              <span>NOTE</span>
              {noteExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={() => onEdit(plan)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
            title={t.plansSection.editBtn}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDeleteRequest(plan)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
            title={t.plansSection.deleteBtn}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Note Row */}
      {plan.note && noteExpanded && (
        <div className="mt-4 pt-4 border-t border-white/5 font-mono text-xs text-zinc-400 leading-relaxed pl-10 sm:pl-16">
          <span className="text-zinc-600 uppercase tracking-widest mr-2">// NOTE:</span>
          {plan.note}
        </div>
      )}
    </article>
  );
};
