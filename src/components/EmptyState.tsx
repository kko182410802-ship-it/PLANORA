import React from 'react';
import { Plus } from 'lucide-react';
import { Language } from '../types/plan';
import { translations } from '../translations';

interface EmptyStateProps {
  currentLang: Language;
  onAddNew: () => void;
  isFilterEmpty?: boolean;
  onClearFilter?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  currentLang,
  onAddNew,
  isFilterEmpty,
  onClearFilter,
}) => {
  const t = translations[currentLang];

  if (isFilterEmpty) {
    return (
      <div className="py-16 px-6 text-left border border-white/10 bg-[#0c0c10] my-8 font-mono">
        <div className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-2">
          STATUS // ZERO_MATCHES
        </div>
        <h3 className="font-display font-light text-xl sm:text-2xl text-white uppercase tracking-wider mb-2">
          {t.emptyState.filterEmptyTitle}
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mb-6 font-light">
          {t.emptyState.filterEmptySubtitle}
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="px-4 py-2 border border-white/20 hover:border-white text-zinc-300 hover:text-white text-xs uppercase tracking-[0.15em] transition-colors"
          >
            {t.emptyState.clearSearch}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-20 px-6 sm:px-12 text-left border border-white/15 bg-[#0c0c10] my-8 font-mono relative overflow-hidden">
      {/* Decorative corner marker */}
      <div className="absolute top-3 right-3 text-[10px] text-zinc-600 tracking-widest uppercase">
        [INDEX // EMPTY_LOG]
      </div>

      <div className="w-10 h-10 border border-white/20 bg-white/5 flex items-center justify-center mb-6">
        <span className="w-2.5 h-2.5 bg-white" />
      </div>

      <h3 className="font-display font-light text-3xl sm:text-4xl text-white uppercase tracking-wider mb-3">
        {t.emptyState.title}
      </h3>
      <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mb-8 leading-relaxed">
        {t.emptyState.subtitle}
      </p>

      <button
        onClick={onAddNew}
        className="inline-flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] active:translate-y-px"
      >
        <Plus className="w-4 h-4" />
        <span>{t.emptyState.button}</span>
      </button>
    </div>
  );
};
