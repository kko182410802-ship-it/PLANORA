import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Language } from '../types/plan';
import { translations } from '../translations';

interface FooterProps {
  currentLang: Language;
  onRestoreDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onRestoreDemo }) => {
  const t = translations[currentLang];

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#060608] py-14 transition-colors font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand & info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white" />
              <span className="font-display font-medium text-sm tracking-[0.2em] uppercase text-white">
                {t.appName}
              </span>
              <span className="text-[10px] text-zinc-500 tracking-widest">// V.4.0 MONO</span>
            </div>
            <p className="text-xs text-zinc-400 font-light max-w-md tracking-wide">
              {t.footer.description}
            </p>
          </div>

          {/* Quick utility action: Restore demo plans */}
          <button
            onClick={onRestoreDemo}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 border border-white/15 hover:border-white text-zinc-400 hover:text-white text-xs uppercase tracking-[0.15em] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.footer.restoreDemo}</span>
          </button>
        </div>

        {/* Bottom line with technical copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-zinc-500 tracking-widest uppercase">
          <div>{t.footer.allRightsReserved}</div>
          <div className="flex items-center gap-4">
            <span>{t.footer.builtFor}</span>
            <span>//</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
